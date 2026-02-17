import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const STATS = [
  { label: "Academy Awards", value: 23, suffix: "", color: "#FFD700" },
  { label: "Feature Films", value: 28, suffix: "+", color: "#87CEEB" },
  { label: "Box Office Revenue", value: 19, suffix: "B+", prefix: "$", color: "#64ffda" },
];

export const LegacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
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

  // Counting stats animation
  const statsAppear = interpolate(frame, [fps * 1.2, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const countProgress = interpolate(frame, [fps * 1.2, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Multi-layer sparkles with varying sizes and colors
  const sparkles = Array.from({ length: 50 }, (_, i) => {
    const layer = i % 3;
    const angle = (i / 50) * Math.PI * 2;
    const baseRadius = 150 + layer * 80 + Math.sin(i * 2.5) * 50;
    const speed = 0.015 + layer * 0.008;
    const x = 50 + Math.cos(angle + frame * speed) * (baseRadius / 19.2);
    const y = 50 + Math.sin(angle + frame * speed) * (baseRadius / 10.8);
    const sparkleOpacity = interpolate(
      Math.sin(frame * 0.08 + i * 0.7),
      [-1, 1],
      [0.05, layer === 2 ? 0.9 : 0.5]
    );
    const size = layer === 0 ? 2 : layer === 1 ? 3.5 : 5;
    const colors = ["#FFD700", "#FFA500", "#87CEEB", "#64ffda", "#FF6347"];
    const color = colors[i % colors.length];
    return { x, y, opacity: sparkleOpacity, size, color };
  });

  // Expanding rings
  const rings = [0, 1, 2].map((i) => {
    const ringDelay = fps * 0.5 + i * Math.round(fps * 0.4);
    const ringProgress = interpolate(frame - ringDelay, [0, fps * 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const radius = interpolate(ringProgress, [0, 1], [0, 400 + i * 120]);
    const opacity = interpolate(ringProgress, [0, 0.2, 1], [0, 0.2, 0]);
    return { radius, opacity };
  });

  // Fade out at the end
  const endFade = interpolate(frame, [fps * 3, fps * 3.8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background gradient rotation
  const bgAngle = interpolate(frame, [0, fps * 4], [0, 15]);

  // Animated gold line under title
  const lineWidth = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: `conic-gradient(from ${bgAngle}deg at 50% 50%, #1a1a4e 0%, #0f0f35 25%, #1a1a4e 50%, #0a0a1a 75%, #1a1a4e 100%)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: endFade,
        overflow: "hidden",
      }}
    >
      {/* Expanding rings */}
      {rings.map((ring, i) => (
        <div
          key={`ring-${i}`}
          style={{
            position: "absolute",
            width: ring.radius * 2,
            height: ring.radius * 2,
            borderRadius: "50%",
            border: "1.5px solid rgba(255, 215, 0, 0.3)",
            opacity: ring.opacity,
          }}
        />
      ))}

      {/* Multi-layer sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: s.color,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
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
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            fontFamily: "Georgia, serif",
            background:
              "linear-gradient(135deg, #FFD700, #FFA500, #FF6347, #FFA500, #FFD700)",
            backgroundSize: "200% 200%",
            backgroundPosition: `${interpolate(frame, [0, fps * 4], [0, 100])}% 50%`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            transform: `scale(${titleSpring})`,
            lineHeight: 1.2,
            filter: "drop-shadow(0 0 25px rgba(255, 215, 0, 0.3))",
          }}
        >
          A Legacy of
          <br />
          Dreams & Innovation
        </div>

        {/* Animated gold line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent)",
            marginTop: 15,
            borderRadius: 1,
          }}
        />

        <div
          style={{
            fontSize: 30,
            color: "#a0c4ff",
            marginTop: 25,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          Together, Disney and Pixar have created some of the most
          beloved stories in the history of cinema
        </div>

        <div
          style={{
            display: "flex",
            gap: 80,
            marginTop: 50,
            opacity: statsAppear,
          }}
        >
          {STATS.map((stat, i) => {
            // Staggered card entrance
            const cardSpring = spring({
              frame: frame - Math.round(fps * 1.3) - i * 5,
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const cardScale = Math.max(0, cardSpring);

            // Counting number
            const currentValue = Math.round(stat.value * countProgress);

            // Pulsing glow per stat
            const statGlow = interpolate(
              Math.sin(frame * 0.1 + i * 2),
              [-1, 1],
              [0.2, 0.5]
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${cardScale})`,
                }}
              >
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: stat.color,
                    fontFamily: "Georgia, serif",
                    textShadow: `0 0 20px rgba(255, 215, 0, ${statGlow})`,
                  }}
                >
                  {stat.prefix || ""}
                  {currentValue}
                  {stat.suffix}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: "#a0aec0",
                    marginTop: 8,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
