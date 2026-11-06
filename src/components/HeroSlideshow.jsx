import { useState, useEffect, useRef, useCallback } from "react";
import "./HeroSlideshow.css";

/* ─────────────────────────────────────────────────────────────
   SERVICE SLIDES DATA  –  All 8 NOOR AL AFIYA service images
───────────────────────────────────────────────────────────── */
import patientCareImg     from "../assets/services/patient-care.webp";
import elderCareImg       from "../assets/services/elder-care.webp";
import newbornCareImg     from "../assets/services/newborn-care.webp";
import childrenCareImg    from "../assets/services/children-care.webp";
import icuCareImg         from "../assets/services/icu-patient-care.jpg";
import cancerCareImg      from "../assets/services/cancer-patient-care.jpg";
import ventilatorCareImg  from "../assets/services/ventilator-patient-care.jpg";
import bloodCollectionImg from "../assets/services/blood-collection-service.jpg";

const SLIDES = [
  {
    id: "patient-care",
    image: patientCareImg,
    alt: "Professional nurse providing patient care at home",
    pos: "center center",        // Well-composed; centre works
  },
  {
    id: "elder-care",
    image: elderCareImg,
    alt: "Caregiver assisting an elderly person at home",
    pos: "center center",
  },
  {
    id: "newborn-care",
    image: newbornCareImg,
    alt: "Nurse providing newborn care at home",
    pos: "center center",
  },
  {
    id: "children-care",
    image: childrenCareImg,
    alt: "Caregiver providing children care at home",
    pos: "center center",
  },
  {
    id: "icu-patient-care",
    image: icuCareImg,
    alt: "Nurse providing ICU-level patient care at home",
    pos: "center center",
  },
  {
    id: "cancer-patient-care",
    image: cancerCareImg,
    alt: "Healthcare professional caring for a cancer patient at home",
    pos: "center center",
  },
  {
    id: "ventilator-patient-care",
    image: ventilatorCareImg,
    alt: "Nurse managing ventilator care for a patient at home",
    pos: "center center",
  },
  {
    id: "blood-collection",
    image: bloodCollectionImg,
    alt: "Healthcare professional performing blood collection at home",
    pos: "center center",
  },
];

/* ─────────────────────────────────────────────────────────────
   TIMING CONSTANTS
   Display time: 3 000 ms (excludes transition)
   Transition:   700 ms  (horizontal slide right→left)
───────────────────────────────────────────────────────────── */
const DISPLAY_MS    = 3000;
const TRANSITION_MS = 700;

const SWIPE_THRESHOLD_PX = 50;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
function HeroSlideshow() {
  /* Track which slide is fully visible (0-based) */
  const [current,       setCurrent]       = useState(0);
  /* Index of the outgoing slide during transition, null at rest */
  const [outgoing,      setOutgoing]      = useState(null);
  /* Phase: "idle" | "sliding" */
  const [phase,         setPhase]         = useState("idle");

  const intervalRef      = useRef(null);
  const transitionRef    = useRef(null);
  const touchStartX      = useRef(null);
  const touchStartY      = useRef(null);

  /* Detect prefers-reduced-motion once on mount */
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* ── Advance to a specific slide with slide-left transition ── */
  const goTo = useCallback((nextIndex, fromIndex) => {
    if (phase === "sliding") return;        // Guard: no overlap
    if (nextIndex === fromIndex) return;

    /* Mark outgoing so the CSS track can position both slides */
    setOutgoing(fromIndex);
    setPhase("sliding");
    setCurrent(nextIndex);

    /* After transition completes, clean up */
    clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setOutgoing(null);
      setPhase("idle");
    }, prefersReduced.current ? 0 : TRANSITION_MS);
  }, [phase]);

  /* ── Auto-advance ── */
  const startInterval = useCallback(() => {
    if (prefersReduced.current) return;
    clearInterval(intervalRef.current);

    /* Use a closure ref to track currentIndex without stale closures */
    let currentIndex = 0;

    /* Sync current index on first run */
    setCurrent(c => { currentIndex = c; return c; });

    intervalRef.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % SLIDES.length;
        /* Trigger transition using functional state access */
        setOutgoing(c);
        setPhase("sliding");
        clearTimeout(transitionRef.current);
        transitionRef.current = setTimeout(() => {
          setOutgoing(null);
          setPhase("idle");
        }, TRANSITION_MS);
        currentIndex = next;
        return next;
      });
    }, DISPLAY_MS + TRANSITION_MS);
  }, []);

  const stopInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  /* ── Start auto-play on mount, clean up on unmount ── */
  useEffect(() => {
    startInterval();
    return () => {
      stopInterval();
      clearTimeout(transitionRef.current);
    };
  }, [startInterval, stopInterval]);

  /* ── Preload the next image ── */
  useEffect(() => {
    const nextIdx = (current + 1) % SLIDES.length;
    const img = new Image();
    img.src = SLIDES[nextIdx].image;
  }, [current]);

  /* ── Manual navigation helpers ── */
  const goNext = useCallback(() => {
    setCurrent(c => {
      const next = (c + 1) % SLIDES.length;
      goTo(next, c);
      return c; /* goTo will update current via setPhase/setCurrent */
    });
    stopInterval();
    startInterval();
  }, [goTo, stopInterval, startInterval]);

  const goPrev = useCallback(() => {
    setCurrent(c => {
      const prev = (c - 1 + SLIDES.length) % SLIDES.length;
      goTo(prev, c);
      return c;
    });
    stopInterval();
    startInterval();
  }, [goTo, stopInterval, startInterval]);

  /* ── Simplified manual goTo for dots/arrows (no stale closure issue) ── */
  const jumpTo = useCallback((targetIndex) => {
    setCurrent(c => {
      if (c === targetIndex || phase === "sliding") return c;
      setOutgoing(c);
      setPhase("sliding");
      clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {
        setOutgoing(null);
        setPhase("idle");
      }, prefersReduced.current ? 0 : TRANSITION_MS);
      return targetIndex;
    });
    stopInterval();
    startInterval();
  }, [phase, stopInterval, startInterval]);

  /* ── Touch swipe ── */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD_PX) {
      if (diffX > 0) goNext(); else goPrev();
    }
  };

  /* ── Keyboard ── */
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft")  { goPrev(); }
    else if (e.key === "ArrowRight") { goNext(); }
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div
      className="hs-root"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="NOOR AL AFIYA Healthcare Services Slideshow"
    >
      {/* ── SLIDE TRACK: clips the horizontal motion ── */}
      <div className="hs-track" aria-live="polite">

        {/* Outgoing slide – slides out to the LEFT */}
        {outgoing !== null && (
          <div
            key={`out-${outgoing}`}
            className={`hs-slide hs-slide--out${phase === "sliding" ? " hs-slide--animating-out" : ""}`}
            aria-hidden="true"
          >
            <img
              src={SLIDES[outgoing].image}
              alt={SLIDES[outgoing].alt}
              className="hs-img"
              style={{ objectPosition: SLIDES[outgoing].pos }}
              draggable="false"
              loading="eager"
            />
          </div>
        )}

        {/* Active slide – enters from the RIGHT */}
        <div
          key={`in-${current}`}
          className={`hs-slide hs-slide--in${phase === "sliding" ? " hs-slide--animating-in" : ""}`}
          aria-roledescription="slide"
          aria-label={`${current + 1} of ${SLIDES.length}`}
        >
          <img
            src={SLIDES[current].image}
            alt={SLIDES[current].alt}
            className="hs-img"
            style={{ objectPosition: SLIDES[current].pos }}
            draggable="false"
            loading="eager"
          />
        </div>

      </div>

      {/* ── LIGHT PINK GRADIENT OVERLAY (stays on top of images, below text) ── */}
      <div className="hs-gradient" aria-hidden="true" />

      {/* ── PREV / NEXT ARROWS ── */}
      <button
        className="hs-arrow hs-arrow--prev"
        onClick={() => goPrev()}
        aria-label="Previous slide"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="hs-arrow hs-arrow--next"
        onClick={() => goNext()}
        aria-label="Next slide"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── SLIDE INDICATOR DOTS ── */}
      <div className="hs-dots" role="tablist" aria-label="Slide indicators">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            className={`hs-dot${i === current ? " hs-dot--active" : ""}`}
            onClick={() => jumpTo(i)}
            aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
            aria-selected={i === current}
            role="tab"
            type="button"
          />
        ))}
      </div>

    </div>
  );
}

export default HeroSlideshow;
