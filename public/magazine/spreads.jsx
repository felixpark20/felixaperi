/* ===========================================
   이생 — Spread components
   Each spread is a static editorial layout
   =========================================== */

const { useState } = React;

/* ---------- shared assets ---------- */

const IMG = {
  cover:       "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80&auto=format&fit=crop",
  ai:          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&q=80&auto=format&fit=crop",
  morning:     "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80&auto=format&fit=crop",
  city1:       "https://images.unsplash.com/photo-1538485399081-7a06aff9b40d?w=900&q=80&auto=format&fit=crop",
  city2:       "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=900&q=80&auto=format&fit=crop",
  city3:       "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80&auto=format&fit=crop",
  city4:       "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=900&q=80&auto=format&fit=crop",
  city5:       "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=80&auto=format&fit=crop",
  city6:       "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=900&q=80&auto=format&fit=crop",
  interview:   "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&q=80&auto=format&fit=crop",
  market:      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80&auto=format&fit=crop",
  next:        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80&auto=format&fit=crop",
};

/* ===========================================
   01 — COVER
   =========================================== */
function CoverSpread() {
  return (
    <div className="spread" style={{ gridTemplateColumns: "1fr 1.05fr" }}>
      {/* left — masthead + cover lines */}
      <div className="page" style={{ paddingTop: "5%", justifyContent: "space-between" }}>
        <div>
          <div className="cover-bar">
            <span>VOL.07 · 2026 · 05</span>
            <span>매일의 발견</span>
          </div>
          <div style={{ marginTop: "8%" }}>
            <div className="eyebrow accent" style={{ marginBottom: 14 }}>이번 호의 주제 · 매일의 발견</div>
            <div className="cover-mast" style={{ paddingBottom: "0.08em" }}>이생</div>
            <div style={{
              fontFamily: "var(--font-label)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginTop: 18,
              color: "var(--ink-soft)",
            }}>
              ISAENG — A QUIET LOOK AT EVERYDAY LIFE
            </div>
          </div>
        </div>

        <div>
          <div className="rule" style={{ background: "var(--ink)", marginBottom: 18 }}></div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            <li style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span className="eyebrow accent" style={{ minWidth: 36 }}>01</span>
              <span className="display" style={{ fontSize: 22 }}>AI와 함께 아침을</span>
            </li>
            <li style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span className="eyebrow accent" style={{ minWidth: 36 }}>02</span>
              <span className="display" style={{ fontSize: 22 }}>5월, 어딘가의 풍경</span>
            </li>
            <li style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span className="eyebrow accent" style={{ minWidth: 36 }}>03</span>
              <span className="display" style={{ fontSize: 22 }}>게임을 만드는 사람들</span>
            </li>
            <li style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span className="eyebrow accent" style={{ minWidth: 36 }}>04</span>
              <span className="display" style={{ fontSize: 22 }}>이달의 숫자 — 주식·스포츠·문화</span>
            </li>
          </ul>
        </div>
      </div>

      {/* right — image */}
      <div className="page no-pad">
        <div className="img-well">
          <img src={IMG.cover} alt="cover" />
          <div style={{
            position: "absolute",
            bottom: 18, right: 18,
            background: "var(--bg)",
            color: "var(--ink)",
            padding: "10px 14px",
            fontFamily: "var(--font-label)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            COVER · SEOUL, BUKCHON · 05.2026
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   02 — TABLE OF CONTENTS
   =========================================== */
function TocSpread() {
  const sections = [
    { kind: "ESSAYS · 에세이", items: [
      { n: "01", t: "AI와 함께 아침을", s: "일상이 된 알고리즘에 관한 짧은 기록", p: "012" },
      { n: "02", t: "편집자의 편지", s: "5월에서 보내는 짧은 안부", p: "008" },
    ]},
    { kind: "FEATURES · 특집", items: [
      { n: "03", t: "5월, 어딘가의 풍경", s: "여섯 도시에서 보낸 한 주 — 사진 에세이", p: "024" },
      { n: "04", t: "게임을 만드는 사람들", s: "독립 스튜디오의 책상 위 — 인터뷰", p: "036" },
    ]},
    { kind: "COLUMNS · 칼럼", items: [
      { n: "05", t: "이달의 숫자", s: "주식, 스포츠, 음악 — 숫자로 본 5월", p: "048" },
      { n: "06", t: "다음 호 예고", s: "이생 No.08 — 여름의 시작", p: "060" },
    ]},
  ];

  return (
    <div className="spread">
      {/* left — masthead block */}
      <div className="page" style={{ background: "var(--bg-soft)", justifyContent: "space-between" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>이생 · NO.07 · 2026.05</div>
          <h1 className="display" style={{ fontSize: 64, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
            이번<br />호의<br />목차
          </h1>
          <div className="eyebrow" style={{ marginTop: 14, color: "var(--accent)" }}>CONTENTS</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="rule"></div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", fontSize: 11, lineHeight: 1.7 }}>
            <span className="eyebrow">편집장</span><span>김도현 KIM DOHYUN</span>
            <span className="eyebrow">아트 디렉터</span><span>박세린 PARK SERIN</span>
            <span className="eyebrow">사진</span><span>이주안 · 한지민 · 정유나</span>
            <span className="eyebrow">발행</span><span>이생 출판 · 서울</span>
            <span className="eyebrow">웹</span><span>isaeng.kr / @isaeng</span>
          </div>
        </div>
      </div>

      {/* right — toc list */}
      <div className="page" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map((sec, i) => (
          <div key={i}>
            <div className="kicker" style={{ color: "var(--accent)", marginBottom: 6 }}>{sec.kind}</div>
            <div>
              {sec.items.map((it, j) => (
                <div className="toc-row" key={j}>
                  <span className="num">{it.n}</span>
                  <span className="ttl">{it.t}<small>{it.s}</small></span>
                  <span className="pg">P.{it.p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===========================================
   03 — EDITOR'S LETTER
   =========================================== */
function EditorSpread() {
  return (
    <div className="spread" style={{ gridTemplateColumns: "0.9fr 1.1fr" }}>
      <div className="page no-pad">
        <div className="img-well">
          <img src={IMG.morning} alt="morning" />
          <div style={{
            position: "absolute", inset: "auto 0 0 0",
            padding: "16px 24px",
            background: "linear-gradient(transparent, rgba(0,0,0,.4))",
            color: "#fff",
          }}>
            <div style={{
              fontFamily: "var(--font-label)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}>
              사진 · 이주안 — 5월의 작업실, 망원동
            </div>
          </div>
        </div>
        <div className="page-foot"><span>이생 NO.07</span><span>008</span></div>
      </div>

      <div className="page" style={{ background: "var(--bg)" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>편집자의 편지 · A LETTER FROM THE EDITOR</div>
        <h2 className="display" style={{ fontSize: 44, marginBottom: 20 }}>
          5월에서<br />보내는<br />짧은 안부.
        </h2>

        <div className="body dropcap" style={{ fontSize: 14, lineHeight: 1.8 }}>
          오늘 아침에는 평소보다 십 분 일찍 일어났습니다. 창을 열자 어딘가에서 라일락 냄새가 났고, 그 향을 한 번 더 맡으려고 가만히 서 있었지요. 그 짧은 순간이, 이번 호를 만드는 내내 마음에 남아 있었습니다.
          <br /><br />
          <span style={{ color: "var(--ink-soft)" }}>
          이번 5월호는 '매일의 발견'이라는 주제로 묶었습니다. 우리가 매일 쓰는 도구들 — 아침의 알고리즘, 점심의 뉴스, 저녁의 게임 — 사이에서 발견되는 작은 장면들을 모았습니다. 거창한 결론을 내리고 싶지는 않았어요. 다만, 익숙해진 것들을 한 번 더 들여다보는 일이 여전히 의미 있다고 믿습니다.
          </span>
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="rule"></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10 }}>
            <div>
              <div className="display" style={{ fontSize: 16 }}>김도현</div>
              <div className="eyebrow" style={{ marginTop: 4 }}>편집장 · EDITOR-IN-CHIEF</div>
            </div>
            <div className="eyebrow">2026 · 05 · 서울</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   04 — FEATURE: AI와 함께 아침을
   =========================================== */
function AiFeatureSpread() {
  return (
    <div className="spread" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>
      <div className="page no-pad" style={{ position: "relative" }}>
        <div className="img-well">
          <img src={IMG.ai} alt="ai feature" />
        </div>
        <div style={{
          position: "absolute",
          left: 24, bottom: 28, right: 24,
          color: "#fff",
        }}>
          <div style={{
            fontFamily: "var(--font-label)",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            marginBottom: 14,
            opacity: 0.9,
          }}>FEATURE · 01 — ESSAY</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(48px, 6vw, 84px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            textShadow: "0 2px 30px rgba(0,0,0,.35)",
          }}>
            AI와 함께<br />아침을.
          </h1>
        </div>
        <div className="page-foot" style={{ color: "#fff" }}><span>이생 NO.07</span><span>012</span></div>
      </div>

      <div className="page">
        <div className="kicker" style={{ color: "var(--accent)", marginBottom: 6 }}>글 · 한지민</div>
        <div className="eyebrow" style={{ marginBottom: 16 }}>일상이 된 알고리즘에 관한 짧은 기록</div>

        <div className="col-2 body" style={{ fontSize: 12.5, lineHeight: 1.78, columnGap: 20 }}>
          <p>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              float: "left",
              lineHeight: 0.85,
              padding: "2px 8px 0 0",
              color: "var(--accent)",
              fontWeight: 700,
            }}>아</span>
            침마다 가장 먼저 켜는 것이 무엇인지 생각해본 적이 있다. 커튼도, 라디오도 아니었다. 잠금 화면을 한 번 풀면 — 날씨, 일정, 어젯밤 메시지의 요약이 한 줄로 모여 있다. 누군가 이미 정리해둔 아침을 받아드는 셈이다.
          </p>
          <p style={{ marginTop: 10 }}>
            편리하다고 말해도 좋고, 익숙해졌다고 말해도 좋다. 다만 그 익숙함이 어떤 모양인지, 어떤 결을 가지고 있는지는 자주 잊는다. 우리는 답을 받는 데에는 능숙해졌지만, 질문을 멈추는 데에는 아직 서툴다.
          </p>
          <p style={{ marginTop: 10, color: "var(--ink-soft)" }}>
            그래서 이 글은 도구를 비판하기 위한 것이 아니다. 오히려 그 반대다. 매일 사용하는 것들을 — 가능하면 천천히 — 다시 들여다보는 일에 가깝다. 무엇이 우리를 대신해 결정하고 있는지, 그 결정들이 우리의 하루를 어떻게 그리고 있는지.
          </p>
          <div className="pull-quote" style={{ fontSize: 18, margin: "14px 0", padding: "10px 0" }}>
            "답을 받는 데에는<br />능숙해졌지만,<br />질문을 멈추는 데에는<br />아직 서툴다."
          </div>
          <p>
            이번 호에서는 세 사람의 아침을 따라가 본다. 알고리즘 디자이너, 출판 편집자, 그리고 아홉 살 아이. 각자의 화면에 무엇이 떠 있었는지, 그날의 첫 결정을 누가 내렸는지.
          </p>
        </div>

        <div className="page-foot"><span>FEATURE · 01</span><span>013</span></div>
      </div>
    </div>
  );
}

/* ===========================================
   05 — PHOTO ESSAY
   =========================================== */
function PhotoEssaySpread() {
  return (
    <div className="spread">
      <div className="page" style={{ background: "var(--bg-soft)", justifyContent: "space-between" }}>
        <div>
          <div className="kicker" style={{ color: "var(--accent)" }}>FEATURE · 02 — PHOTO ESSAY</div>
          <h2 className="display" style={{ fontSize: 56, marginTop: 14, lineHeight: 0.95 }}>
            5월,<br />어딘가의<br />풍경.
          </h2>
          <div className="eyebrow" style={{ marginTop: 16 }}>여섯 도시에서 보낸 한 주</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ position: "relative", aspectRatio: "1/1.2" }}>
            <div className="img-well"><img src={IMG.city1} alt="" /></div>
          </div>
          <div style={{ position: "relative", aspectRatio: "1/1.2" }}>
            <div className="img-well"><img src={IMG.city2} alt="" /></div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-label)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
          <span>SEOUL · TOKYO · TAIPEI</span>
          <span>사진 정유나</span>
        </div>

        <div className="page-foot"><span>이생 NO.07</span><span>024</span></div>
      </div>

      <div className="page no-pad" style={{ background: "var(--bg-deep)" }}>
        <div style={{ display: "grid", gridTemplateRows: "1.4fr 1fr", height: "100%" }}>
          <div className="img-well" style={{ position: "relative" }}>
            <img src={IMG.city3} alt="" />
            <div style={{
              position: "absolute",
              bottom: 14, left: 16, right: 16,
              color: "#fff",
              fontFamily: "var(--font-label)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textShadow: "0 1px 4px rgba(0,0,0,.5)",
            }}>03 — 오후 4시, 한적한 골목</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            <div className="img-well"><img src={IMG.city4} alt="" /></div>
            <div className="img-well"><img src={IMG.city5} alt="" /></div>
            <div className="img-well"><img src={IMG.city6} alt="" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   06 — INTERVIEW Q&A
   =========================================== */
function InterviewSpread() {
  return (
    <div className="spread" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="page no-pad">
        <div className="img-well">
          <img src={IMG.interview} alt="interview" />
        </div>
        <div style={{
          position: "absolute",
          left: 28, bottom: 30, right: 28,
          color: "#fff",
        }}>
          <div className="tag accent" style={{ marginBottom: 12, color: "#1a1a1a" }}>INTERVIEW</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            textShadow: "0 2px 30px rgba(0,0,0,.4)",
          }}>
            게임을<br />만드는<br />사람들.
          </h1>
          <div style={{
            fontFamily: "var(--font-label)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginTop: 14,
            opacity: 0.9,
          }}>
            STUDIO YEONHUI · 망원동의 작은 책상에서
          </div>
        </div>
        <div className="page-foot" style={{ color: "#fff" }}><span>FEATURE · 02</span><span>036</span></div>
      </div>

      <div className="page">
        <div className="eyebrow" style={{ marginBottom: 8 }}>인터뷰 · 박지원 (디렉터)</div>
        <div className="body" style={{ fontSize: 12, lineHeight: 1.65, color: "var(--ink-soft)", marginBottom: 14 }}>
          연희에서 두 사람이 시작한 독립 게임 스튜디오. 다음 작품은 잔잔한 어드벤처 한 편. 인터뷰는 5월 어느 흐린 오후, 작업실에서 진행됐다.
        </div>

        <div className="qa" style={{ fontSize: 13 }}>
          <div className="q">처음 만든 게임을 기억하시나요?</div>
          <div className="a">고등학교 때 친구랑 만든 텍스트 어드벤처요. 두 사람이 플레이했고, 한 명이 끝까지 갔어요. 그게 전부였는데도, 끝까지 갔다는 그 한 사람 때문에 계속 만들고 있는 것 같아요.</div>

          <div className="q">왜 큰 스튜디오에 가지 않으셨어요?</div>
          <div className="a">큰 곳에서도 일했어요. 그런데 회의가 너무 많아서, 일주일에 한 번도 만들지 않는 주가 있었어요. 그게 조금 무서웠던 것 같아요.</div>

          <div className="q">요즘은 AI 도구를 쓰시나요?</div>
          <div className="a">스크립트 정리할 때, 변수 이름 고를 때 자주 써요. 다만 결정은 사람이 해야 한다고 생각해요. 도구는 잘 듣는 동료고, 결정은 우리 둘의 몫이에요.</div>

          <div className="q">다음 게임은 어떤 이야기예요?</div>
          <div className="a"><i>한 사람이 도시를 떠나기 전에 들르는 곳들을 따라가는 이야기예요. 짧고, 조용해요.</i></div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div className="rule"></div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10 }}>
            <span className="eyebrow">취재 · 한지민 / 사진 · 이주안</span>
            <span className="eyebrow">P.037</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   07 — NUMBERS / DATA piece
   =========================================== */
function NumbersSpread() {
  return (
    <div className="spread">
      <div className="page" style={{ background: "var(--bg)" }}>
        <div className="kicker" style={{ color: "var(--accent)" }}>COLUMN · 05 — DATA</div>
        <h2 className="display" style={{ fontSize: 64, marginTop: 12, lineHeight: 0.95 }}>
          이달의<br />숫자.
        </h2>
        <div className="eyebrow" style={{ marginTop: 14, marginBottom: 22 }}>
          주식 · 스포츠 · 음악 — 숫자로 본 5월
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 28px" }}>
          <div className="stat-card">
            <div className="lbl">KOSPI · 월간 변동</div>
            <div className="num">+3.4<span className="unit">%</span></div>
            <div className="desc">반도체와 이차전지 섹터가 견인. 외인 순매수 9거래일 연속.</div>
          </div>
          <div className="stat-card">
            <div className="lbl">BTC · 5월 평균가</div>
            <div className="num">98.2<span className="unit">K$</span></div>
            <div className="desc">10만 달러 부근에서 횡보. 일간 변동성은 작년 대비 절반.</div>
          </div>
          <div className="stat-card">
            <div className="lbl">KBO · 잠실 최다 관중</div>
            <div className="num">23,750<span className="unit">명</span></div>
            <div className="desc">어린이날 더블헤더. 평일 평균은 12,400명으로 5월 신기록.</div>
          </div>
          <div className="stat-card">
            <div className="lbl">국내 차트 1위곡 재생 수</div>
            <div className="num">412<span className="unit">M</span></div>
            <div className="desc">발매 14일 만에 4억 회. 30대 청취자 비중이 전년 대비 두 배.</div>
          </div>
        </div>

        <div className="page-foot"><span>이생 NO.07</span><span>048</span></div>
      </div>

      <div className="page" style={{ background: "var(--bg-soft)" }}>
        <div className="kicker">짧게 짚는 5월 · BRIEFS</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <BriefRow n="01" tag="AI" title="모두를 위한 비서, 라는 말의 의미"
                   body="국내 LLM 점유율은 1년 만에 두 배. 사용 시간은 평균 17분/일." />
          <BriefRow n="02" tag="STOCKS" title="개미가 다시 돌아온 5월"
                   body="개인 순매수 1조원 돌파. 2차전지 관련주에 집중." />
          <BriefRow n="03" tag="SPORTS" title="이번 시즌, 가장 빠른 직구"
                   body="158km/h — 5월 셋째 주, 사직에서. 투구 후 더그아웃은 조용했다." />
          <BriefRow n="04" tag="GAMES" title="작은 스튜디오의 큰 한 달"
                   body="국내 인디게임 동시접속자 50만 명을 처음으로 넘긴 주말." />
          <BriefRow n="05" tag="MEDIA" title="OTT 한 편의 평균 시청 시간"
                   body="63분 — 2년 전보다 18분 짧아졌다. 영상은 점점 빠르게 끝난다." />
        </div>

        <div style={{ marginTop: "auto" }}>
          <div className="rule"></div>
          <div style={{
            paddingTop: 10,
            fontFamily: "var(--font-label)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span>자료 · 한국거래소 / KBO / Spotify Charts</span>
            <span>P.049</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefRow({ n, tag, title, body }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "32px 70px 1fr",
      gap: 12,
      alignItems: "baseline",
      paddingBottom: 12,
      borderBottom: "1px solid color-mix(in oklab, var(--ink) 12%, transparent)",
    }}>
      <span className="eyebrow accent">{n}</span>
      <span className="tag">{tag}</span>
      <div>
        <div className="display" style={{ fontSize: 16, marginBottom: 4 }}>{title}</div>
        <div className="body" style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{body}</div>
      </div>
    </div>
  );
}

/* ===========================================
   08 — BACK / NEXT ISSUE
   =========================================== */
function BackSpread() {
  return (
    <div className="spread" style={{ gridTemplateColumns: "1fr 0.95fr" }}>
      <div className="page no-pad">
        <div className="img-well">
          <img src={IMG.next} alt="next" />
        </div>
        <div style={{
          position: "absolute", inset: "auto 0 0 0",
          padding: "26px 28px",
          background: "linear-gradient(transparent, rgba(0,0,0,.55))",
          color: "#fff",
        }}>
          <div style={{
            fontFamily: "var(--font-label)",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            opacity: 0.85,
            marginBottom: 8,
          }}>NEXT · 이생 NO.08 · 2026.06</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 48,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}>여름의<br />시작.</div>
        </div>
      </div>

      <div className="page" style={{ background: "var(--bg-soft)", justifyContent: "space-between" }}>
        <div>
          <div className="eyebrow">다음 호 미리보기 · COMING IN JUNE</div>
          <h3 className="display" style={{ fontSize: 30, marginTop: 12, lineHeight: 1.1 }}>
            바다, 자전거,<br />그리고 한낮의 그림자.
          </h3>
          <div className="body" style={{ marginTop: 14, fontSize: 13, color: "var(--ink-soft)" }}>
            여름이 시작되는 도시들을 따라갑니다. 부산, 가마쿠라, 그리고 다낭에서 보낸 일주일. 그리고 — 처음으로 시도하는 음식 칼럼.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="rule"></div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-label)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}>
            <span>이생 출판 · 서울</span>
            <span>@ISAENG · ISAENG.KR</span>
          </div>
        </div>

        <div className="page-foot"><span>BACK COVER</span><span>060</span></div>
      </div>
    </div>
  );
}

/* ===========================================
   Spread registry
   =========================================== */
const SPREADS = [
  { id: "cover",     label: "COVER",       Comp: CoverSpread },
  { id: "toc",       label: "CONTENTS",    Comp: TocSpread },
  { id: "editor",    label: "EDITOR",      Comp: EditorSpread },
  { id: "ai",        label: "AI",          Comp: AiFeatureSpread },
  { id: "photo",     label: "PHOTO",       Comp: PhotoEssaySpread },
  { id: "interview", label: "INTERVIEW",   Comp: InterviewSpread },
  { id: "numbers",   label: "NUMBERS",     Comp: NumbersSpread },
  { id: "back",      label: "NEXT",        Comp: BackSpread },
];

Object.assign(window, { SPREADS });
