import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const MergerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mergeProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  const disneyX = interpolate(mergeProgress, [0, 1], [-300, -60]);
  const pixarX = interpolate(mergeProgress, [0, 1], [300, 60]);

  const plusOpacity = interpolate(mergeProgress, [0.3, 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const detailsOpacity = interpolate(frame, [fps * 1.5, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const detailsY = interpolate(frame, [fps * 1.5, fps * 2.2], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.7]
  );

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #1a1a4e 0%, #0a0a2e 70%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255, 215, 0, ${glowIntensity * 0.15}) 0%, transparent 70%)`,
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
            fontSize: 80,
            fontWeight: 900,
            color: "#FFD700",
            marginBottom: 10,
            textShadow: "0 0 30px rgba(255, 215, 0, 0.4)",
            fontFamily: "Georgia, serif",
          }}
        >
          2006
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#87CEEB",
              fontFamily: "Georgia, serif",
              transform: `translateX(${disneyX}px)`,
            }}
          >
            Disney
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: 300,
              color: "#FFD700",
              opacity: plusOpacity,
              margin: "0 10px",
            }}
          >
            +
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#64ffda",
              fontFamily: "monospace",
              transform: `translateX(${pixarX}px)`,
            }}
          >
            Pixar
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 36,
            fontWeight: 600,
            color: "#ffffff",
            opacity: detailsOpacity,
            transform: `translateY(${detailsY}px)`,
            textAlign: "center",
          }}
        >
          Disney acquires Pixar for $7.4 billion
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            color: "#a0aec0",
            opacity: detailsOpacity,
            transform: `translateY(${detailsY}px)`,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.6,
          }}
        >
          Two animation powerhouses become one,
          combining Disney's legacy with Pixar's innovation
        </div>
      </div>
    </AbsoluteFill>
  );
};
