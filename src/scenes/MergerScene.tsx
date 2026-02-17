import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const MergerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 2006 year entrance
  const yearSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Logo merge animation - logos converge with spring
  const mergeSpring = spring({
    frame: frame - Math.round(fps * 0.3),
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  const disneyX = interpolate(mergeSpring, [0, 1], [-400, -70]);
  const pixarX = interpolate(mergeSpring, [0, 1], [400, 70]);
  const disneyRotate = interpolate(mergeSpring, [0, 1], [-10, 0]);
  const pixarRotate = interpolate(mergeSpring, [0, 1], [10, 0]);

  const plusOpacity = interpolate(mergeSpring, [0.4, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const plusScale = spring({
    frame: frame - Math.round(fps * 0.8),
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Details text
  const detailsOpacity = interpolate(frame, [fps * 1.3, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const detailsY = interpolate(frame, [fps * 1.3, fps * 1.8], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const descOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY = interpolate(frame, [fps * 1.6, fps * 2.2], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Shockwave ring on merge
  const shockwaveDelay = Math.round(fps * 1.0);
  const shockwaveProgress = interpolate(
    frame - shockwaveDelay,
    [0, fps * 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shockwaveRadius = interpolate(shockwaveProgress, [0, 1], [0, 600]);
  const shockwaveOpacity = interpolate(shockwaveProgress, [0, 0.3, 1], [0, 0.5, 0]);

  // Orbiting particles around merge point
  const orbitParticles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 + frame * 0.04;
    const baseRadius = 180 + Math.sin(i * 3.7) * 40;
    // Particles spiral inward as merge happens
    const radiusMultiplier = interpolate(mergeSpring, [0, 1], [1.8, 1], {
      extrapolateRight: "clamp",
    });
    const r = baseRadius * radiusMultiplier;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * (r * 0.4);
    const pOpacity = interpolate(
      Math.sin(frame * 0.1 + i * 0.8),
      [-1, 1],
      [0.15, 0.6]
    );
    const size = 2 + (i % 4) * 1.5;
    const color = i % 2 === 0 ? "#87CEEB" : "#64ffda";
    return { x, y, opacity: pOpacity, size, color };
  });

  // Pulsing glow
  const glowIntensity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.2, 0.5]
  );

  // Converging energy lines
  const lineCount = 8;
  const energyLines = Array.from({ length: lineCount }, (_, i) => {
    const angle = (i / lineCount) * Math.PI * 2;
    const lineProgress = interpolate(
      frame - Math.round(fps * 0.5),
      [0, fps * 0.8],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const length = 600 * lineProgress;
    const startX = Math.cos(angle) * length;
    const startY = Math.sin(angle) * length * 0.5;
    return { startX, startY, angle, opacity: lineProgress * 0.3 };
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #1a1a4e 0%, #0f0f35 40%, #0a0a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255, 215, 0, ${glowIntensity * 0.15}) 0%, rgba(100, 255, 218, ${glowIntensity * 0.08}) 40%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Converging energy lines */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        {energyLines.map((line, i) => (
          <line
            key={`eline-${i}`}
            x1={960 + line.startX}
            y1={540 + line.startY}
            x2={960}
            y2={540}
            stroke="rgba(255, 215, 0, 0.15)"
            strokeWidth={1.5}
            opacity={line.opacity}
          />
        ))}
      </svg>

      {/* Shockwave ring */}
      <div
        style={{
          position: "absolute",
          width: shockwaveRadius * 2,
          height: shockwaveRadius * 2,
          borderRadius: "50%",
          border: "2px solid rgba(255, 215, 0, 0.4)",
          opacity: shockwaveOpacity,
          boxShadow: `0 0 20px rgba(255, 215, 0, ${shockwaveOpacity * 0.5})`,
        }}
      />

      {/* Orbiting particles */}
      {orbitParticles.map((p, i) => (
        <div
          key={`orbit-${i}`}
          style={{
            position: "absolute",
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y - 20}px)`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
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
            color: "#FFD700",
            marginBottom: 10,
            textShadow:
              "0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.15)",
            fontFamily: "Georgia, serif",
            transform: `scale(${yearSpring})`,
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
              transform: `translateX(${disneyX}px) rotate(${disneyRotate}deg)`,
              textShadow: "0 0 25px rgba(135, 206, 235, 0.4)",
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
              transform: `scale(${Math.max(0, plusScale)})`,
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
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
              transform: `translateX(${pixarX}px) rotate(${pixarRotate}deg)`,
              textShadow: "0 0 25px rgba(100, 255, 218, 0.4)",
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
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
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
