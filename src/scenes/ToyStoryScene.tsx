import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const TOY_STORY_LETTERS = "TOY STORY".split("");

export const ToyStoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const yearScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  // Bouncing letter entrance for "TOY STORY"
  const letterAnimations = TOY_STORY_LETTERS.map((char, i) => {
    const delay = Math.round(fps * 0.5) + i * 3;
    const letterSpring = spring({
      frame: frame - delay,
      fps,
      config: { damping: 8, stiffness: 180 },
    });
    const scale = Math.max(0, letterSpring);
    const rotation = interpolate(letterSpring, [0, 0.5, 1], [-15, 5, 0]);
    return { char, scale, rotation };
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.6, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [fps * 0.6, fps * 1.2], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const descOpacity = interpolate(frame, [fps * 1.0, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY = interpolate(frame, [fps * 1.0, fps * 1.5], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Parallax cloud layers
  const cloudLayers = [
    // Far clouds - slow
    { clouds: [{ x: 5, y: 10, w: 220, h: 70 }, { x: 55, y: 5, w: 180, h: 55 }, { x: 85, y: 12, w: 160, h: 50 }], speed: 0.1, opacity: 0.4 },
    // Mid clouds
    { clouds: [{ x: 20, y: 18, w: 250, h: 85 }, { x: 70, y: 14, w: 200, h: 70 }], speed: 0.2, opacity: 0.65 },
    // Near clouds - fast
    { clouds: [{ x: -5, y: 22, w: 300, h: 100 }, { x: 45, y: 20, w: 240, h: 80 }], speed: 0.35, opacity: 0.85 },
  ];

  // Rainbow arc that sweeps in
  const rainbowProgress = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Star burst effect with rotation
  const starBurstSpring = spring({
    frame: frame - Math.round(fps * 2),
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const starRotation = interpolate(frame, [fps * 2, fps * 4], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sun rays rotating
  const sunRotation = frame * 0.3;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #5BA4E6 0%, #87CEEB 25%, #98D8F0 50%, #FFE8C0 80%, #FFE4B5 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        overflow: "hidden",
      }}
    >
      {/* Sun with rotating rays */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,235,150,0.8) 0%, rgba(255,200,50,0.3) 40%, transparent 70%)",
          transform: `rotate(${sunRotation}deg)`,
        }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 360;
          return (
            <div
              key={`ray-${i}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 3,
                height: 160,
                backgroundColor: "rgba(255, 220, 80, 0.15)",
                transformOrigin: "top center",
                transform: `rotate(${angle}deg)`,
                borderRadius: 2,
              }}
            />
          );
        })}
      </div>

      {/* Parallax clouds */}
      {cloudLayers.map((layer, li) =>
        layer.clouds.map((cloud, ci) => {
          const drift = Math.sin(frame * 0.02 * layer.speed + ci * 2) * 5;
          const xPos = cloud.x + frame * layer.speed * 0.15 + drift;
          return (
            <div
              key={`cloud-${li}-${ci}`}
              style={{
                position: "absolute",
                left: `${xPos % 120 - 20}%`,
                top: `${cloud.y}%`,
                width: cloud.w,
                height: cloud.h,
                borderRadius: cloud.h,
                backgroundColor: `rgba(255, 255, 255, ${layer.opacity})`,
                boxShadow: `0 ${4 + li * 2}px ${10 + li * 5}px rgba(0, 0, 0, 0.05)`,
              }}
            />
          );
        })
      )}

      {/* Rainbow arc */}
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 450,
          borderRadius: "450px 450px 0 0",
          border: "none",
          opacity: rainbowProgress * 0.25,
          background: "transparent",
          boxShadow: `
            inset 0 0 0 8px rgba(255, 0, 0, 0.4),
            inset 0 0 0 16px rgba(255, 127, 0, 0.4),
            inset 0 0 0 24px rgba(255, 255, 0, 0.4),
            inset 0 0 0 32px rgba(0, 200, 0, 0.4),
            inset 0 0 0 40px rgba(0, 100, 255, 0.4),
            inset 0 0 0 48px rgba(75, 0, 130, 0.3)
          `,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            fontFamily: "Arial, sans-serif",
            color: "#1a5276",
            transform: `scale(${yearScale})`,
            textShadow:
              "3px 3px 0 rgba(255,255,255,0.5), 0 0 40px rgba(26,82,118,0.3)",
          }}
        >
          1995
        </div>

        {/* Bouncing letter title */}
        <div
          style={{
            display: "flex",
            marginTop: 10,
          }}
        >
          {letterAnimations.map((l, i) => (
            <span
              key={i}
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "#d35400",
                fontFamily: "Arial Black, sans-serif",
                display: "inline-block",
                transform: `scale(${l.scale}) rotate(${l.rotation}deg)`,
                textShadow:
                  "3px 3px 0 rgba(0,0,0,0.15), 0 0 20px rgba(211,84,0,0.3)",
                letterSpacing: l.char === " " ? 15 : 2,
              }}
            >
              {l.char === " " ? "\u00A0" : l.char}
            </span>
          ))}
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#1a5276",
            marginTop: 10,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: "center",
          }}
        >
          The first fully computer-animated feature film
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#2c3e50",
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          A groundbreaking achievement that proved CGI could tell
          heart-warming stories and launched a new era of filmmaking
        </div>

        {/* Rotating star burst */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 20,
            transform: `scale(${Math.max(0, starBurstSpring)}) rotate(${starRotation}deg)`,
          }}
        >
          {[...Array(5)].map((_, i) => {
            const individualPulse = interpolate(
              Math.sin(frame * 0.15 + i * 1.2),
              [-1, 1],
              [0.85, 1.15]
            );
            return (
              <div
                key={i}
                style={{
                  fontSize: 44,
                  color: "#f1c40f",
                  textShadow:
                    "0 0 15px rgba(241, 196, 15, 0.6), 0 0 30px rgba(241, 196, 15, 0.3)",
                  transform: `scale(${individualPulse})`,
                }}
              >
                &#9733;
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
