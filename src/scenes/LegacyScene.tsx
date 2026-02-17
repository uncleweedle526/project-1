import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const LegacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.8, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [fps * 0.8, fps * 1.5], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statsOpacity = interpolate(frame, [fps * 1.5, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparkle particles
  const sparkles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 200 + Math.sin(i * 2.5) * 100;
    const speed = 0.02 + (i % 5) * 0.005;
    const x = 50 + Math.cos(angle + frame * speed) * (radius / 19.2);
    const y = 50 + Math.sin(angle + frame * speed) * (radius / 10.8);
    const sparkleOpacity = interpolate(
      Math.sin(frame * 0.1 + i),
      [-1, 1],
      [0.1, 0.8]
    );
    return { x, y, opacity: sparkleOpacity, size: 3 + (i % 3) };
  });

  // Fade out at the end
  const endFade = interpolate(frame, [fps * 3, fps * 3.8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #1a1a4e 0%, #0a0a1a 80%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: endFade,
      }}
    >
      {/* Sparkles */}
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
            backgroundColor: "#FFD700",
            opacity: s.opacity,
            boxShadow: "0 0 6px rgba(255, 215, 0, 0.5)",
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
            background: "linear-gradient(135deg, #FFD700, #FFA500, #FF6347, #FFD700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            transform: `scale(${titleSpring})`,
            lineHeight: 1.2,
          }}
        >
          A Legacy of
          <br />
          Dreams & Innovation
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#a0c4ff",
            marginTop: 30,
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
            opacity: statsOpacity,
          }}
        >
          {[
            { label: "Academy Awards", value: "23" },
            { label: "Feature Films", value: "28+" },
            { label: "Billions in Revenue", value: "$19B+" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#FFD700",
                  fontFamily: "Georgia, serif",
                }}
              >
                {stat.value}
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
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
