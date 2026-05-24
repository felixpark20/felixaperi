/* ===========================================
   이생 — App shell
   =========================================== */

const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sand",
  "typePair": "editorial"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("fwd");
  const [exitingIdx, setExitingIdx] = useState(null);
  const animTimer = useRef(null);

  useEffect(() => {
    document.body.dataset.palette = t.palette;
    document.body.dataset.type = t.typePair;
  }, [t.palette, t.typePair]);

  const total = SPREADS.length;

  const go = useCallback((nextRaw) => {
    setIndex((cur) => {
      const next = Math.max(0, Math.min(total - 1, nextRaw));
      if (next === cur) return cur;
      setDirection(next > cur ? "fwd" : "bwd");
      setExitingIdx(cur);
      clearTimeout(animTimer.current);
      animTimer.current = setTimeout(() => setExitingIdx(null), 550);
      return next;
    });
  }, [total]);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") { go(0); }
      else if (e.key === "End") { go(total - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total]);

  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  const wheelLock = useRef(0);
  const onWheel = (e) => {
    const now = Date.now();
    if (now - wheelLock.current < 700) return;
    if (Math.abs(e.deltaX) < 30 && Math.abs(e.deltaY) < 30) return;
    wheelLock.current = now;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    (delta > 0 ? next : prev)();
  };

  return (
    <React.Fragment>
      <div className="stage"
           onTouchStart={onTouchStart}
           onTouchEnd={onTouchEnd}
           onWheel={onWheel}>
        <div className="spread-wrap"
             data-screen-label={`${String(index + 1).padStart(2, "0")} ${SPREADS[index].label}`}>
          <div className="flip-stage">
            {exitingIdx != null && (() => {
              const ExitComp = SPREADS[exitingIdx].Comp;
              const exitClass = direction === "fwd" ? "flip-exit-fwd" : "flip-exit-bwd";
              return (
                <div className={"spread-layer " + exitClass} key={"exit-" + exitingIdx}>
                  <ExitComp />
                </div>
              );
            })()}
            {(() => {
              const Comp = SPREADS[index].Comp;
              const enterClass = direction === "fwd" ? "flip-enter-fwd" : "flip-enter-bwd";
              return (
                <div className={"spread-layer " + enterClass} key={"in-" + index}>
                  <Comp />
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="nav-chrome">
        <button onClick={prev} disabled={index === 0} aria-label="previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="dots">
          {SPREADS.map((s, i) => (
            <span key={s.id}
                  className={"dot" + (i === index ? " active" : "")}
                  title={s.label}
                  onClick={() => go(i)} />
          ))}
        </div>
        <span className="count">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <button onClick={next} disabled={index === total - 1} aria-label="next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio
          label="Color"
          value={t.palette}
          options={[
            { value: "sand",  label: "Sand" },
            { value: "stone", label: "Stone" },
            { value: "mint",  label: "Mint" },
          ]}
          onChange={(v) => setTweak("palette", v)}
        />

        <TweakSection label="Typography" />
        <TweakRadio
          label="Pairing"
          value={t.typePair}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "modern",    label: "Modern" },
            { value: "playful",   label: "Playful" },
          ]}
          onChange={(v) => setTweak("typePair", v)}
        />

        <TweakSection label="Jump to spread" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "2px 14px 12px" }}>
          {SPREADS.map((s, i) => (
            <button key={s.id}
                    onClick={() => go(i)}
                    style={{
                      appearance: "none",
                      background: i === index ? "rgba(0,0,0,.08)" : "rgba(0,0,0,.02)",
                      color: "#29261b",
                      border: "1px solid rgba(0,0,0,.08)",
                      borderRadius: 6,
                      padding: "7px 10px",
                      fontFamily: "ui-sans-serif, system-ui",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textAlign: "left",
                      cursor: "pointer",
                    }}>
              <div style={{ opacity: 0.45, fontSize: 9, marginBottom: 1 }}>{String(i + 1).padStart(2, "0")}</div>
              {s.label}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
