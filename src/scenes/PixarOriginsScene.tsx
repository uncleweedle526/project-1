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

  const yearScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [fps * 0.5, fps * 1.2], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Animated pixel grid background
  const gridSize = 8;
  const pixels = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const delay = (row + col) * 3;
    const pixelOpacity = interpolate(
      frame - delay,
      [0, fps * 0.3],
      [0, 0.08],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { row, col, opacity: pixelOpacity };
  });

  // Lamp bounce animation
  const lampBounce = spring({
    frame: frame - Math.round(fps * 2),
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1a365d 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Pixel grid background */}
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
            border: "1px solid rgba(100, 255, 218, 0.03)",
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
            textShadow: "0 0 40px rgba(100, 255, 218, 0.5)",
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
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
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
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
            fontFamily: "monospace",
            letterSpacing: 6,
          }}
        >
          PIXAR
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 28,
            color: "#a0aec0",
            opacity: textOpacity,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          Born from Lucasfilm's computer graphics division,
          Pixar set out to revolutionize animation with technology
        </div>

        {/* Pixar lamp representation */}
        <div
          style={{
            marginTop: 40,
            transform: `scale(${Math.max(0, lampBounce)}) translateY(${interpolate(Math.max(0, lampBounce), [0, 0.5, 1], [0, -20, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
              boxShadow: "0 0 30px rgba(100, 255, 218, 0.6)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
