import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const TITLE_TEXT = "Disney & Pixar";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered letter reveal for main title
  const letters = TITLE_TEXT.split("").map((char, i) => {
    const delay = i * 2;
    const letterSpring = spring({
      frame: frame - delay,
      fps,
      config: { damping: 15, stiffness: 120 },
    });
    const letterScale = Math.max(0, letterSpring);
    const letterOpacity = interpolate(letterSpring, [0, 0.5, 1], [0, 0.8, 1]);
    const letterY = interpolate(letterSpring, [0, 1], [40, 0]);
    return { char, scale: letterScale, opacity: letterOpacity, y: letterY };
  });

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [fps * 1.2, fps * 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [fps * 1.2, fps * 2], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Animated underline that draws from center outward
  const underlineWidth = interpolate(frame, [fps * 1.5, fps * 2.2], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Stars with depth layers (far = slow, near = fast)
  const stars = Array.from({ length: 60 }, (_, i) => {
    const layer = i % 3; // 0=far, 1=mid, 2=near
    const seed1 = ((i * 137.5 + 42) % 100);
    const seed2 = ((i * 73.1 + 17) % 100);
    const size = layer === 0 ? 1.5 : layer === 1 ? 2.5 : 4;
    const baseOpacity = layer === 0 ? 0.4 : layer === 1 ? 0.6 : 0.9;
    const twinkleSpeed = 0.06 + layer * 0.04;
    const twinkle = interpolate(
      Math.sin(frame * twinkleSpeed + i * 1.7),
      [-1, 1],
      [baseOpacity * 0.3, baseOpacity]
    );
    // Slow drift based on layer depth
    const driftX = Math.sin(frame * 0.008 * (layer + 1) + i) * (0.3 + layer * 0.2);
    const driftY = Math.cos(frame * 0.006 * (layer + 1) + i * 0.7) * (0.2 + layer * 0.15);
    return { x: seed1 + driftX, y: seed2 + driftY, size, twinkle };
  });

  // Rotating sparkle ring around the title
  const ringSparkles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + frame * 0.025;
    const rx = 420;
    const ry = 160;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    const sparkleOpacity = interpolate(
      Math.sin(frame * 0.12 + i * 0.8),
      [-1, 1],
      [0.1, 0.7]
    );
    const sparkleScale = interpolate(
      Math.sin(frame * 0.08 + i * 1.2),
      [-1, 1],
      [0.5, 1.2]
    );
    // Fade ring in
    const ringFade = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y, opacity: sparkleOpacity * ringFade, scale: sparkleScale };
  });

  // Vignette / radial glow pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.15, 0.25]
  );

  // Shimmer effect on title (animated gradient position)
  const shimmerX = interpolate(frame, [0, fps * 3], [-100, 200], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #1a1a3e 0%, #0d0d24 50%, #050510 100%)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Multi-layer stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            opacity: star.twinkle,
            boxShadow:
              star.size > 3
                ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.4)`
                : "none",
          }}
        />
      ))}

      {/* Radial glow behind title */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(255,215,0,${glowPulse}) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Sparkle ring */}
      {ringSparkles.map((s, i) => (
        <div
          key={`ring-${i}`}
          style={{
            position: "absolute",
            left: `calc(50% + ${s.x}px)`,
            top: `calc(50% + ${s.y - 30}px)`,
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#FFD700",
            opacity: s.opacity,
            transform: `scale(${s.scale})`,
            boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* Letter-by-letter title */}
        <div style={{ display: "flex", position: "relative" }}>
          {letters.map((l, i) => (
            <span
              key={i}
              style={{
                fontSize: 110,
                fontWeight: 900,
                fontFamily: "Georgia, serif",
                background: `linear-gradient(135deg, #FFD700 0%, #FFA500 40%, #FFD700 60%, #FFF8DC ${shimmerX}%, #FFD700 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                transform: `translateY(${l.y}px) scale(${l.scale})`,
                opacity: l.opacity,
                lineHeight: 1.1,
                letterSpacing: l.char === " " ? 12 : -2,
                textShadow: "none",
                filter: `drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))`,
              }}
            >
              {l.char === " " ? "\u00A0" : l.char}
            </span>
          ))}
        </div>

        {/* Animated golden underline */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent)",
            marginTop: 10,
            borderRadius: 1,
            opacity: subtitleOpacity,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 300,
            color: "#a0c4ff",
            marginTop: 24,
            letterSpacing: 12,
            textTransform: "uppercase",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          A Story of Magic & Innovation
        </div>
      </div>
    </AbsoluteFill>
  );
};
