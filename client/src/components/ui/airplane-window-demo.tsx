"use client";

import * as React from "react";
import { AirplaneWindowGallery } from "@/components/ui/airplane-window-gallery";
import type { WindowItem } from "@/components/ui/airplane-window-gallery";

const settings = {
  windows: 2,
  autoplay: true,
  interval: 2100,
  drift: 18,
  shadeDuration: 400,
};

const VIEWS = [
  { id: "photo-1523632117739-12cc7fa95ad0", title: "South Malé Atoll", location: "Maldives", caption: "A sandbar curls through turquoise shallows." },
  { id: "photo-1636110330362-6f04cde3f1e4", title: "Mount Fuji", location: "Japan", caption: "The summit rises clean above the clouds." },
  { id: "photo-1615551043360-33de8b5f410c", title: "Grand Canyon", location: "United States", caption: "Layers of red rock and a winding river." },
  { id: "photo-1681407979901-566ba5099a0e", title: "Swiss Alps", location: "Switzerland", caption: "Snowy peaks seen from cruising altitude." },
  { id: "photo-1489516408517-0c0a15662682", title: "Dubai", location: "United Arab Emirates", caption: "The Palm and its crescent from above." },
  { id: "photo-1552561618-4fe029f7858a", title: "Glacial rivers", location: "Iceland", caption: "Meltwater braids across the valley floor." },
  { id: "photo-1789758612733-756075c4fb4c", title: "Great Barrier Reef", location: "Australia", caption: "Coral reefs scattered through clear blue water." },
  { id: "photo-1523374228107-6e44bd2b524e", title: "New York", location: "United States", caption: "The city lights up after dark." },
];

const ITEMS: WindowItem[] = VIEWS.map(({ id, title, location, caption }) => ({
  src: `https://images.unsplash.com/${id}?w=900&h=920&fit=crop&q=80&auto=format`,
  alt: `${title}, ${location}`,
  title,
  location,
  caption,
}));

const CCGATHER_URL = "https://ccgather.com/?utm_source=21st&utm_medium=component&utm_campaign=airplane_window_gallery";

export type AirplaneWindowDemoProps = {
  windows?: number;
  autoplay?: boolean;
  interval?: number;
  drift?: number;
  shadeDuration?: number;
  tour?: boolean;
};

export default function AirplaneWindowDemo({ tour = true, ...props }: AirplaneWindowDemoProps = {}) {
  const s = { ...settings, ...props };
  const [activeWindow, setActiveWindow] = React.useState(null as number | null);
  const [reduced, setReduced] = React.useState(false);
  const [tourStopped, setTourStopped] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [replay, setReplay] = React.useState(0);
  const [step, setStep] = React.useState("reveal");
  const stopTour = () => setTourStopped(true);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (!tour || !s.autoplay || reduced || tourStopped || paused) return;
    const change = window.setTimeout(() => setStep("change"), s.interval);
    // Let the first replacement shade finish lifting before looking through that window.
    const lookAt = s.interval + s.shadeDuration * 2 + 200;
    const look = window.setTimeout(() => { setActiveWindow(0); setStep("lookout"); }, lookAt);
    // 650ms to fly out, then 2.4 seconds outside before the 480ms return.
    const back = window.setTimeout(() => { setActiveWindow(null); setStep("returned"); }, lookAt + 650 + 2000);
    return () => { window.clearTimeout(change); window.clearTimeout(look); window.clearTimeout(back); };
  }, [tour, s.autoplay, s.interval, s.shadeDuration, reduced, tourStopped, paused, replay]);

  const restart = () => {
    setActiveWindow(null);
    setStep("reveal");
    setTourStopped(false);
    setPaused(false);
    setReplay(replay + 1);
  };

  return (
    <section
      data-airplane-demo
      data-tour={tour && s.autoplay && !reduced && !tourStopped && !paused}
      onPointerDownCapture={stopTour}
      onKeyDownCapture={stopTour}
      onFocusCapture={(event) => { if ((event.target as HTMLElement).matches("button, a")) stopTour(); }}
      className="airplane-gallery-wrap flex w-full flex-col items-center justify-center gap-4 bg-background px-4 py-8 text-foreground"
    >
      <header className="text-center" style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent-cyan, #38bdf8)", marginBottom: "4px" }}>
          The Window Seat Experience
        </p>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary, #fff)", margin: "0 0 6px 0" }}>
          Interactive Cabin Gallery
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
          Lift the shade. Fly through the window. Return to your seat.
        </p>
      </header>
      <div style={{ width: "100%", maxWidth: "700px", minHeight: "460px", position: "relative", margin: "1rem auto" }}>
        <AirplaneWindowGallery
          key={replay}
          items={ITEMS}
          windows={s.windows}
          autoplay={s.autoplay && !paused}
          interval={s.interval}
          drift={paused ? 0 : s.drift}
          shadeDuration={s.shadeDuration}
          activeWindow={activeWindow}
          onActiveWindowChange={setActiveWindow}
          style={{ width: "100%", minHeight: "460px" }}
        />
      </div>
      <div style={{ display: "flex", width: "100%", maxWidth: "640px", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", fontSize: "12px", color: "var(--text-secondary, #94a3b8)", marginTop: "1rem" }}>
        <p data-tour-caption className="font-medium text-foreground/80">
          {activeWindow !== null
            ? "Click anywhere to sit back."
            : step === "change" && !tourStopped
            ? "A new destination, behind the same window."
            : step === "returned"
            ? "Back at your window seat. Fly out again."
            : "Click any window to look out into the world."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            data-replay
            onClick={restart}
            className="rounded-sm text-foreground underline decoration-border underline-offset-4 hover:text-cyan-400 transition-colors"
          >
            Replay preview
          </button>
          {s.autoplay && !reduced && (
            <button
              type="button"
              data-pause
              aria-pressed={paused}
              onClick={() => { setPaused(!paused); setTourStopped(true); }}
              className="rounded-sm underline decoration-border underline-offset-4 hover:text-cyan-400 transition-colors"
            >
              {paused ? "Resume motion" : "Pause motion"}
            </button>
          )}
          <span aria-hidden="true">·</span>
          <a
            href={CCGATHER_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm underline decoration-border underline-offset-4 hover:text-foreground"
          >
            By CCgather
          </a>
        </div>
      </div>
    </section>
  );
}
