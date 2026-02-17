import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [fps * 1, fps * 2], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const starCount = 20;
  const stars = Array.from({ length: starCount }, (_, i) => {
    const x = ((i * 137.5) % 100);
    const y = ((i * 73.1) % 100);
    const size = 2 + (i % 3) * 2;
    const twinkle = interpolate(
      Math.sin(frame * 0.1 + i * 1.5),
      [-1, 1],
      [0.3, 1]
    );
    return { x, y, size, twinkle };
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 70%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            fontFamily: "Georgia, serif",
            background: "linear-gradient(135deg, #FFD700, #FFA500, #FFD700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          Disney & Pixar
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 300,
            color: "#a0c4ff",
            marginTop: 20,
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
