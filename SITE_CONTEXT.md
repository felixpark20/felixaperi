# felixaperi.com — 전체 컨텍스트 & 운영 가이드

> 이 문서 하나로 사이트 구조, 아키텍처, 이슈 히스토리, 배포 방법을 모두 파악할 수 있다.
> 다른 Claude 세션에서 작업할 때 이 파일을 먼저 읽으면 된다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 사이트 | https://felixaperi.com |
| 목적 | APERI 카드뉴스 + 칼럼 + 리포트 공개 사이트 |
| 스택 | React 18.3.1 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui |
| 호스팅 | Netlify (auto-deploy from GitHub) |
| 데이터 저장 | Netlify Blobs |
| GitHub | `felixpark20/felixaperi` (메인, Netlify 연결) |
| 미러 | `felixjpark/Websitefigma` (작업 클론 — Claude 세션에서 사용) |
| 로컬 폴더 | `~/APERI/felixaperi/` (Felix의 맥에 있음) |

---

## 2. Git & 배포 워크플로우

### 계정 구분
- **felixpark20** = Netlify에 연결된 메인 계정. 이쪽으로 push해야 자동 배포됨.
- **felixjpark** = 개인 미러. Netlify 배포와 무관.

### Claude가 push하는 방법 (세션 내 클론 사용)
```bash
# 1. 클론이 없으면
git clone https://<TOKEN>@github.com/felixpark20/felixaperi.git /sessions/.../Websitefigma

# 2. 있으면 remote token 갱신 후 push
git remote set-url felixpark20 https://<TOKEN>@github.com/felixpark20/felixaperi.git
git push felixpark20 main
```

### 토큰
- Felix가 세션마다 새 토큰을 줄 수 있음 (`ghp_...` 형식, felixpark20 계정)
- 토큰은 세션 내에서만 쓰고, 메모리에 저장하지 말 것

### Felix가 직접 push하는 경우
- Felix는 `~/APERI/felixaperi/`에서 SSH로 `git push` 가능
- Claude는 Felix 맥의 로컬 폴더에 직접 접근 불가 → 파일 수정 후 항상 세션 클론에서 push

---

## 3. 데이터 아키텍처 (Netlify Blobs)

### 핵심 원칙: 두 계층 분리

```
Netlify Blobs "cardnews" store
├── list-slim         → 메타데이터 목록 (id, title, date, views, pdfName)  ~수KB
├── card-{id}         → 카드 풀 데이터 (images 배열 base64, pdfUrl base64) ~1-5MB each
└── list              → (레거시, 마이그레이션 원본, 더 이상 안 씀)
```

#### list-slim 필드
```json
{ "id": 1787467277121, "title": "August 23rd, 2026", "date": "Aug 23, 2026", "views": 0, "pdfName": "APERI_2026_08_23.pdf" }
```
- **thumbnail 없음, images 없음** — 이게 핵심. 없어야 slim이 수KB로 유지됨.

#### card-{id} 필드
```json
{ "id": ..., "title": ..., "date": ..., "images": ["data:image/...base64...x5"], "pdfUrl": "data:application/pdf;base64,...", "pdfName": "...", "views": 0 }
```

### 왜 이렇게 설계했나

**문제:** 카드뉴스 117개 × (이미지5 × ~300KB base64 + PDF ~1MB) ≈ **36MB** 를 단일 blob `"list"` 에 저장  
→ `/api/cardnews` GET 응답이 36MB → Netlify 함수 응답 한도(6MB) 초과 → **무한 hang**  
→ 사이트가 "Loading..." 에서 멈춤

**해결:**
1. `list-slim` — 메타데이터만, 항상 수KB → GET /api/cardnews 즉시 응답
2. `card-{id}` — 카드 클릭 시 `/api/cardnews-detail/:id` 로 lazy fetch
3. 어드민 edit 시에도 `/api/cardnews-detail/:id` 로 full card 먼저 fetch 후 폼에 채움

---

## 4. Netlify Functions 파일 목록

| 파일 | 경로 | 역할 |
|------|------|------|
| `cardnews.mts` | `/api/cardnews` | GET: list-slim 반환 / POST,PUT: 새 카드 저장+slim 업데이트 / DELETE,PATCH: 삭제·views |
| `cardnews-detail.mts` | `/api/cardnews-detail/:id` | GET: card-{id} 풀 데이터 반환 |
| `cardnews-migrate-background.mts` | `/api/cardnews-migrate` (POST) | 레거시 `"list"` blob → card-{id} 분할 + list-slim 재생성. 백그라운드 함수(202 즉시 반환, 최대 15분 실행) |
| `articles.mts` | `/api/articles` | 칼럼 CRUD |
| `reports.mts` | `/api/reports` | 리포트 CRUD |
| `magazines.mts` | `/api/magazines` | 매거진 CRUD |

### cardnews.mts toSlim() — 절대 thumbnail 넣지 말 것
```typescript
const toSlim = (card: any) => ({
  id: card.id,
  title: card.title,
  date: card.date,
  views: card.views ?? 0,
  pdfName: card.pdfName ?? null,
  // ❌ thumbnail 절대 포함하면 안 됨 → list-slim이 12MB로 불어남
});
```

---

## 5. 프론트엔드 핵심 컴포넌트

### CardNewsGrid.tsx
- `list-slim` 데이터만 받음 → images 없음
- 이미지 없는 카드는 **파스텔 컬러 플레이스홀더** 표시 (`card.id % PASTEL_COLORS.length`)
- 클릭 시 `CardNewsDetail`로 이동

### CardNewsDetail.tsx
- `useEffect`에서 `card.images`가 비어있으면 `/api/cardnews-detail/:id` 자동 fetch
- `fullCard ?? card` 패턴으로 이미지 로드 후 렌더링

### CardNewsUpload.tsx (어드민)
- edit 버튼 클릭 시 `handleEditCard` → **먼저 `/api/cardnews-detail/:id` fetch** → images로 폼 채움
- slim card만 있으면 이미지 없이 edit 폼 열림 (버그) → 이미 수정됨

### App.tsx
- 모든 API fetch에 `fetchWithTimeout` (9초 AbortController) 적용
- `/api/cardnews` hang 시 timeout 후 빈 배열 fallback

---

## 6. 마이그레이션 실행 방법

레거시 `"list"` blob에서 새 구조로 변환하거나 `list-slim`을 재생성할 때:

```javascript
// 브라우저 콘솔에서 (felixaperi.com 열고 실행)
fetch('/api/cardnews-migrate', { method: 'POST' })
  .then(r => console.log(r.status))  // 202 = 성공적으로 시작됨
```

- 202 받으면 90~120초 대기 후 사이트 새로고침
- 확인: `/api/cardnews` GET → `count=117` 이상 나오면 완료

**Claude가 Chrome MCP로 대신 실행하는 방법:**
```javascript
// mcp__claude-in-chrome__javascript_tool 으로
const r = await fetch('/api/cardnews-migrate', { method: 'POST' }); r.status
// → 202
```

---

## 7. 이슈 히스토리 & 해결 기록

| 날짜 | 이슈 | 원인 | 해결 |
|------|------|------|------|
| 2026-09 | 사이트 "Loading..." 무한 hang | 36MB 단일 blob → Netlify 6MB 응답 한도 초과 | slim list + per-card blob 분리 |
| 2026-09 | list-slim도 12MB | toSlim()에 thumbnail(첫 이미지) 포함 | thumbnail 제거 |
| 2026-09 | 어드민 edit에서 이미지 안 뜸 | slim card 그대로 edit 폼에 채워서 | handleEditCard에서 detail API 먼저 fetch |
| 2026-09 | `netlify/netlify/` 중첩 폴더 | cp 실수로 기존 netlify/ 안에 또 netlify/ 생성 | rm -rf로 삭제 후 재작업 |
| 이전 | GitHub token 만료 | 구 토큰 `ghp_WWn...`, `ghp_ZXJ...` 만료 | Felix가 새 토큰 제공 후 remote URL 업데이트 |

---

## 8. 배포 체크리스트

새 기능/수정 후:

1. **수정** → `/sessions/.../Websitefigma/` 또는 `~/APERI/felixaperi/` 에서 파일 수정
2. **커밋** → `git add <파일> && git commit -m "..."`
3. **푸시** → `git push felixpark20 main` (felixpark20 계정 토큰 필요)
4. **Netlify 확인** → https://app.netlify.com/projects/felixaperi/deploys — "Published" 뜰 때까지 대기 (보통 20-30초)
5. **마이그레이션 필요 시** → `/api/cardnews-migrate` POST 실행, 90초 대기

---

## 9. 자주 쓰는 디버그 명령

```javascript
// 카드 개수 확인
fetch('/api/cardnews').then(r=>r.json()).then(d=>console.log(d.length))

// 특정 카드 풀 데이터 확인
fetch('/api/cardnews-detail/1787467277121').then(r=>r.json()).then(console.log)

// list-slim 크기 확인 (12MB 넘으면 thumbnail 포함된 것)
fetch('/api/cardnews').then(r=>r.text()).then(t=>console.log((t.length/1024).toFixed(1)+'KB'))
```

---

## 10. 파일 구조 요약

```
felixaperi/
├── netlify/
│   └── functions/
│       ├── cardnews.mts                    ← 핵심 API (slim list 기반)
│       ├── cardnews-detail.mts             ← 개별 카드 full data
│       ├── cardnews-migrate-background.mts ← 레거시 마이그레이션
│       ├── articles.mts
│       ├── reports.mts
│       └── magazines.mts
├── src/
│   └── app/
│       ├── App.tsx                         ← fetchWithTimeout, Promise.all API 호출
│       └── components/
│           ├── CardNewsGrid.tsx            ← 파스텔 컬러 플레이스홀더
│           ├── CardNewsDetail.tsx          ← lazy load 이미지
│           ├── CardNewsUpload.tsx          ← 어드민 업로드/edit (detail API fetch)
│           ├── AdminPanel.tsx
│           └── ...
├── public/
│   └── googlef3f5625c7e4c09c5.html        ← Google Search Console 인증
├── SITE_CONTEXT.md                         ← 이 파일
└── package.json
```

---

*최종 업데이트: 2026-09-02. 작성: Claude (Cowork 세션)*
