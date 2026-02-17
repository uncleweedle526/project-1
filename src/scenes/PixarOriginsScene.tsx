import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const PixarOriginsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Year entrance
  const yearScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Staggered text lines
  const text1Opacity = interpolate(frame, [fps * 0.4, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text1Y = interpolate(frame, [fps * 0.4, fps * 0.9], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const text2Opacity = interpolate(frame, [fps * 0.6, fps * 1.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Y = interpolate(frame, [fps * 0.6, fps * 1.1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
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

  // Animated pixel grid with wave cascade
  const gridSize = 12;
  const pixels = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    // Diagonal wave delay
    const delay = (row + col) * 2;
    const pixelOpacity = interpolate(
      frame - delay,
      [0, fps * 0.3],
      [0, 0.1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    // Pulse effect
    const pulse = interpolate(
      Math.sin(frame * 0.06 + row * 0.5 + col * 0.3),
      [-1, 1],
      [0.03, 0.12]
    );
    return { row, col, opacity: Math.max(pixelOpacity, 0) + pulse };
  });

  // Scanning line effect
  const scanY = interpolate(frame, [0, fps * 4], [0, 100], {
    extrapolateRight: "extend",
  }) % 100;

  // Circuit-like connecting lines
  const circuitOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lamp animation: drops from top, bounces
  const lampDelay = Math.round(fps * 1.8);
  const lampSpring = spring({
    frame: frame - lampDelay,
    fps,
    config: { damping: 6, stiffness: 120 },
  });
  const lampY = interpolate(Math.max(0, lampSpring), [0, 0.5, 1], [-80, 10, 0]);
  const lampScale = Math.max(0, lampSpring);
  // Lamp light cone
  const lampLightOpacity = interpolate(
    Math.max(0, lampSpring),
    [0, 1],
    [0, 0.4]
  );
  const lampLightPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.5]
  );

  // Data stream particles
  const dataParticles = Array.from({ length: 15 }, (_, i) => {
    const speed = 2 + (i % 4) * 0.8;
    const x = 5 + (i * 6.5) % 90;
    const y = ((frame * speed + i * 50) % 120) - 10;
    const pOpacity = interpolate(y, [0, 50, 100], [0, 0.4, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y, opacity: pOpacity };
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0a192f 0%, #0f2847 40%, #112240 70%, #1a365d 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        overflow: "hidden",
      }}
    >
      {/* Pixel grid background with wave */}
      {pixels.map((pixel, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(pixel.col / gridSize) * 100}%`,
            top: `${(pixel.row / gridSize) * 100}%`,
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
            backgroundColor: "#64ffda",
            opacity: pixel.opacity,
            border: "1px solid rgba(100, 255, 218, 0.02)",
          }}
        />
      ))}

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: `${scanY}%`,
          width: "100%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.4), transparent)",
          boxShadow: "0 0 20px rgba(100, 255, 218, 0.2)",
        }}
      />

      {/* Circuit lines */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: circuitOpacity,
        }}
      >
        {[
          "M 100 300 L 300 300 L 300 500 L 500 500",
          "M 1400 200 L 1200 200 L 1200 400 L 1000 400",
          "M 200 700 L 400 700 L 400 900 L 600 900",
          "M 1600 600 L 1400 600 L 1400 800 L 1200 800",
        ].map((d, i) => {
          const dashOffset = interpolate(frame, [0, fps * 4], [200, 0]);
          return (
            <path
              key={i}
              d={d}
              stroke="rgba(100, 255, 218, 0.3)"
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="8 12"
              strokeDashoffset={dashOffset + i * 20}
            />
          );
        })}
        {/* Circuit nodes */}
        {[
          [300, 300],
          [300, 500],
          [1200, 200],
          [1200, 400],
          [400, 700],
          [400, 900],
          [1400, 600],
          [1400, 800],
        ].map(([cx, cy], i) => (
          <circle
            key={`node-${i}`}
            cx={cx}
            cy={cy}
            r={3}
            fill="#64ffda"
            opacity={circuitOpacity * 0.8}
          />
        ))}
      </svg>

      {/* Data stream particles */}
      {dataParticles.map((p, i) => (
        <div
          key={`dp-${i}`}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 2,
            height: 8,
            borderRadius: 1,
            backgroundColor: "#64ffda",
            opacity: p.opacity,
            boxShadow: "0 0 6px rgba(100, 255, 218, 0.4)",
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
            fontSize: 140,
            fontWeight: 900,
            fontFamily: "monospace",
            color: "#64ffda",
            transform: `scale(${yearScale})`,
            textShadow:
              "0 0 40px rgba(100, 255, 218, 0.5), 0 0 80px rgba(100, 255, 218, 0.2)",
          }}
        >
          1986
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginTop: 20,
            opacity: text1Opacity,
            transform: `translateY(${text1Y}px)`,
            textAlign: "center",
          }}
        >
          Steve Jobs acquires
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#64ffda",
            marginTop: 10,
            opacity: text2Opacity,
            transform: `translateY(${text2Y}px)`,
            textAlign: "center",
            fontFamily: "monospace",
            letterSpacing: 10,
            textShadow: "0 0 30px rgba(100, 255, 218, 0.3)",
          }}
        >
          PIXAR
        </div>

        <div
          style={{
            marginTop: 25,
            fontSize: 28,
            color: "#a0aec0",
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          Born from Lucasfilm's computer graphics division,
          Pixar set out to revolutionize animation with technology
        </div>

        {/* Pixar lamp with light cone */}
        <div
          style={{
            marginTop: 35,
            transform: `scale(${lampScale}) translateY(${lampY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Light cone */}
          <div
            style={{
              position: "absolute",
              top: 50,
              width: 0,
              height: 0,
              borderLeft: "40px solid transparent",
              borderRight: "40px solid transparent",
              borderTop: `60px solid rgba(100, 255, 218, ${lampLightOpacity * lampLightPulse})`,
              filter: "blur(8px)",
            }}
          />
          <div
            style={{
              width: 8,
              height: 30,
              backgroundColor: "#64ffda",
            }}
          />
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "#64ffda",
              boxShadow:
                "0 0 30px rgba(100, 255, 218, 0.6), 0 0 60px rgba(100, 255, 218, 0.3)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
