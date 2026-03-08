import GymObjectsScene from "@/components/GymObjectsScene";
import { useActor } from "@/hooks/useActor";
import { useEffect, useRef, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "duplicate" | "error";

const FITNESS_IMAGES = [
  "/assets/generated/thryv_strength.dim_1200x800.jpg",
  "/assets/generated/thryv_sprint_sunset.dim_1200x800.jpg",
  "/assets/generated/thryv_tape.dim_1200x800.jpg",
  "/assets/generated/thryv_yoga.dim_1200x800.jpg",
  "/assets/generated/thryv_savasana.dim_1200x800.jpg",
  "/assets/generated/thryv_run.dim_1200x800.jpg",
  "/assets/generated/thryv_pool_mountains.dim_1200x800.jpg",
  "/assets/generated/thryv_grip.dim_1200x800.jpg",
  "/assets/generated/thryv_hydration.dim_1200x800.jpg",
  "/assets/generated/thryv_meditation.dim_1200x800.jpg",
];

const FRAME_DURATION = 600; // ms per frame — slower for cinematic feel
const CROSSFADE_DURATION = 280; // ms for cross-fade between frames
const KEN_BURNS_SCALE = 1.08; // subtle zoom amount

function useThryvCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Preload images
    const imgs = FITNESS_IMAGES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    imagesRef.current = imgs;

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === imgs.length) {
        loadedRef.current = true;
      }
    };
    for (const img of imgs) {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", onLoad);
      }
    }
    if (loadedCount === imgs.length) loadedRef.current = true;

    return () => {
      for (const img of imgs) img.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function getFontSize(): number {
      // Mobile-first: larger vw fraction so letters fill phone screens well
      const vw = window.innerWidth;
      // clamp(96px, 30vw, 380px) -- bigger THRYV text
      return Math.max(96, Math.min(380, vw * 0.3));
    }

    function resize() {
      if (!canvas || !container) return;
      const fontSize = getFontSize();
      // Canvas height = font size * 1.0 (tight bounding, letters are all caps)
      const canvasH = Math.round(fontSize * 0.88);
      const canvasW = container.offsetWidth;
      canvas.width = canvasW * window.devicePixelRatio;
      canvas.height = canvasH * window.devicePixelRatio;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
    }

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    window.addEventListener("resize", resize);

    startTimeRef.current = performance.now();

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const elapsed = now - startTimeRef.current;

      const totalCycle = FRAME_DURATION * FITNESS_IMAGES.length;
      const cyclePos = elapsed % totalCycle;
      const currentIndex = Math.floor(cyclePos / FRAME_DURATION);
      const nextIndex = (currentIndex + 1) % FITNESS_IMAGES.length;
      const framePos = cyclePos % FRAME_DURATION;

      // Cross-fade alpha: 0 = fully current, 1 = fully next
      const fadeStart = FRAME_DURATION - CROSSFADE_DURATION;
      const alpha =
        framePos > fadeStart ? (framePos - fadeStart) / CROSSFADE_DURATION : 0;

      // Ken Burns: slow zoom in during each frame
      const kenBurns = 1 + (KEN_BURNS_SCALE - 1) * (framePos / FRAME_DURATION);

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      function drawImage(
        img: HTMLImageElement,
        opacity: number,
        scale: number,
      ) {
        if (!ctx || !canvas) return;
        if (!img.complete || img.naturalWidth === 0) return;
        ctx.save();
        ctx.globalAlpha = opacity;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = W / H;

        let drawW: number;
        let drawH: number;
        let drawX: number;
        let drawY: number;
        // Cover fill
        if (imgAspect > canvasAspect) {
          drawH = H * scale;
          drawW = drawH * imgAspect;
        } else {
          drawW = W * scale;
          drawH = drawW / imgAspect;
        }
        drawX = (W - drawW) / 2;
        drawY = (H - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      const imgs = imagesRef.current;

      if (loadedRef.current) {
        // Draw current frame
        drawImage(imgs[currentIndex], 1, kenBurns);
        // Draw next frame on top during cross-fade
        if (alpha > 0) {
          drawImage(imgs[nextIndex], alpha, 1);
        }
      } else {
        // Fallback: draw whichever images have loaded
        drawImage(imgs[currentIndex] || imgs[0], 1, kenBurns);
      }

      // ── SUBTLE COLOR GRADE: cool teal/cyan tint to unify the look ──
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.36;
      ctx.fillStyle = "rgb(100, 230, 220)";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // ── CLIPPING MASK: draw THRYV text using destination-in ──
      const fontSize = getFontSize();
      const scaledFont = fontSize * window.devicePixelRatio;

      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.globalAlpha = 1;
      ctx.font = `900 ${scaledFont}px "Mona Sans", Impact, "Arial Black", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#ffffff";
      // Slight vertical nudge to center text in canvas height
      const textY = (H - scaledFont * 0.88) / 2;
      ctx.fillText("THRYV", W / 2, textY);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return { canvasRef, containerRef };
}

export default function App() {
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { canvasRef, containerRef } = useThryvCanvas();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitState === "loading" || !actor) return;

    setSubmitState("loading");
    setErrorMessage("");

    try {
      const result = await actor.addEmail(email.trim());
      if (result.__kind__ === "success") {
        setSubmitState("success");
      } else {
        const msg = result.error || "";
        const isDuplicate =
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("exist") ||
          msg.toLowerCase().includes("registered");
        setErrorMessage(
          isDuplicate
            ? "This email is already registered."
            : msg || "Something went wrong. Please try again.",
        );
        setSubmitState(isDuplicate ? "duplicate" : "error");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setSubmitState("error");
    }
  }

  return (
    <div
      style={{
        background: "#000000",
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 12px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* 3D floating gym objects background */}
      <GymObjectsScene />

      {/* Content layer sits above the 3D scene */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* THRYV canvas clipping mask */}
        <div
          ref={containerRef}
          aria-label="THRYV"
          style={{
            width: "100%",
            maxWidth: "min(96vw, 1100px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              imageRendering: "auto",
            }}
          />
        </div>

        {/* Email capture */}
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "160px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              width: "100%",
              justifyContent: "center",
            }}
            className="thryv-form-row"
          >
            <input
              data-ocid="email.input"
              type="email"
              className={`thryv-input${
                submitState === "success"
                  ? " thryv-input--success"
                  : submitState === "duplicate" || submitState === "error"
                    ? " thryv-input--error"
                    : ""
              }`}
              placeholder="Your Community Is Waiting..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (
                  submitState === "error" ||
                  submitState === "duplicate" ||
                  submitState === "success"
                )
                  setSubmitState("idle");
              }}
              required
              autoComplete="email"
              aria-label="Email address"
              disabled={submitState === "loading" || submitState === "success"}
              style={{ flex: 1, textAlign: "center" }}
            />
          </form>

          {/* Success state */}
          {submitState === "success" && (
            <div
              data-ocid="email.success_state"
              style={{
                textAlign: "center",
                color: "rgba(0,255,120,0.9)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                fontFamily: "inherit",
              }}
            >
              You&rsquo;re on the list.
            </div>
          )}

          {/* Error / duplicate state */}
          {(submitState === "error" || submitState === "duplicate") && (
            <div
              data-ocid="email.error_state"
              style={{
                color:
                  submitState === "duplicate"
                    ? "rgba(255, 80, 60, 0.9)"
                    : "rgba(255, 80, 60, 0.9)",
                fontSize: "12px",
                textAlign: "center",
                letterSpacing: "0.03em",
                fontFamily: "inherit",
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>

        <style>{`
        @media (max-width: 480px) {
          .thryv-form-row {
            flex-direction: column !important;
          }
        }
      `}</style>
      </div>
      {/* end content layer */}
    </div>
  );
}
