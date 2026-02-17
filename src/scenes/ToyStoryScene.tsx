import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const ToyStoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const yearScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [fps * 0.4, fps * 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [fps * 0.4, fps * 1], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Floating cloud shapes
  const clouds = [
    { x: 10, y: 15, scale: 1.2, speed: 0.3 },
    { x: 60, y: 8, scale: 0.8, speed: 0.2 },
    { x: 35, y: 20, scale: 1, speed: 0.25 },
    { x: 80, y: 12, scale: 0.7, speed: 0.35 },
  ];

  // Star burst effect
  const starBurst = spring({
    frame: frame - Math.round(fps * 1.5),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #87CEEB 0%, #98D8F0 40%, #FFE4B5 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Animated clouds */}
      {clouds.map((cloud, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${cloud.x + Math.sin(frame * 0.02 * cloud.speed) * 3}%`,
            top: `${cloud.y}%`,
            width: 200 * cloud.scale,
            height: 80 * cloud.scale,
            borderRadius: 100,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
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
            fontFamily: "Arial, sans-serif",
            color: "#1a5276",
            transform: `scale(${yearScale})`,
            textShadow: "3px 3px 0 rgba(0,0,0,0.1)",
          }}
        >
          1995
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#d35400",
            marginTop: 10,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
            fontFamily: "Arial Black, sans-serif",
            letterSpacing: 2,
            textShadow: "3px 3px 0 rgba(0,0,0,0.15)",
          }}
        >
          TOY STORY
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#1a5276",
            marginTop: 10,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          The first fully computer-animated feature film
        </div>

        <div
          style={{
            marginTop: 25,
            fontSize: 28,
            color: "#2c3e50",
            opacity: textOpacity,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          A groundbreaking achievement that proved CGI could tell
          heart-warming stories and launched a new era of filmmaking
        </div>

        {/* Star decorations */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 20,
            transform: `scale(${Math.max(0, starBurst)})`,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                fontSize: 40,
                color: "#f1c40f",
                textShadow: "0 0 10px rgba(241, 196, 15, 0.5)",
              }}
            >
              &#9733;
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
