import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const MOVIES = [
  { title: "Finding Nemo", year: "2003", color: "#0077B6", icon: "🐠" },
  { title: "The Incredibles", year: "2004", color: "#E63946", icon: "💥" },
  { title: "Ratatouille", year: "2007", color: "#6A994E", icon: "🍳" },
  { title: "WALL-E", year: "2008", color: "#9B5DE5", icon: "🤖" },
  { title: "Up", year: "2009", color: "#F4A261", icon: "🎈" },
];

export const GoldenEraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, fps * 0.4], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const headerScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Subtitle with letter spacing animation
  const subOpacity = interpolate(frame, [fps * 0.3, fps * 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subSpacing = interpolate(frame, [fps * 0.3, fps * 0.7], [20, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Spotlight sweep
  const spotlightX = interpolate(frame, [0, fps * 4], [-20, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background animated gradient
  const bgHueShift = interpolate(frame, [0, fps * 4], [0, 20], {
    extrapolateRight: "clamp",
  });

  // Floating bokeh particles
  const bokehs = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 47.3 + 11) % 100;
    const y = (i * 31.7 + 23) % 100;
    const size = 20 + (i % 5) * 15;
    const speed = 0.01 + (i % 4) * 0.005;
    const floatX = x + Math.sin(frame * speed + i * 2) * 3;
    const floatY = y + Math.cos(frame * speed * 0.7 + i) * 2;
    const bokehOpacity = interpolate(
      Math.sin(frame * 0.05 + i * 0.9),
      [-1, 1],
      [0.02, 0.06]
    );
    return { x: floatX, y: floatY, size, opacity: bokehOpacity };
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${220 + bgHueShift}, 40%, 12%) 0%, hsl(${210 + bgHueShift}, 35%, 22%) 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        overflow: "hidden",
      }}
    >
      {/* Spotlight sweep */}
      <div
        style={{
          position: "absolute",
          left: `${spotlightX}%`,
          top: "-20%",
          width: 200,
          height: "140%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
          transform: "skewX(-15deg)",
        }}
      />

      {/* Bokeh particles */}
      {bokehs.map((b, i) => (
        <div
          key={`bokeh-${i}`}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,215,0,${b.opacity * 3}) 0%, transparent 70%)`,
            opacity: b.opacity,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#FFD700",
            textAlign: "center",
            opacity: headerOpacity,
            transform: `translateY(${headerY}px) scale(${headerScale})`,
            fontFamily: "Georgia, serif",
            marginBottom: 8,
            textShadow:
              "0 0 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.15)",
          }}
        >
          The Golden Era
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#a0aec0",
            opacity: subOpacity,
            marginBottom: 50,
            letterSpacing: subSpacing,
            textTransform: "uppercase",
          }}
        >
          Hit after hit after hit
        </div>

        <div
          style={{
            display: "flex",
            gap: 30,
            justifyContent: "center",
          }}
        >
          {MOVIES.map((movie, i) => {
            // Each card flies in from a different direction with rotation
            const cardDelay = Math.round(fps * 0.5) + i * 5;
            const cardSpring = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 14, stiffness: 110 },
            });
            const cardScale = Math.max(0, cardSpring);
            const cardRotation = interpolate(cardSpring, [0, 0.5, 1], [
              (i % 2 === 0 ? -12 : 12),
              (i % 2 === 0 ? 2 : -2),
              0,
            ]);
            const cardY = interpolate(cardSpring, [0, 1], [
              i % 2 === 0 ? 60 : -60,
              0,
            ]);

            // Hover glow effect
            const glowPulse = interpolate(
              Math.sin(frame * 0.08 + i * 1.5),
              [-1, 1],
              [0.1, 0.4]
            );

            // Color bar at top of card that grows
            const barWidth = interpolate(
              frame - cardDelay,
              [fps * 0.3, fps * 0.8],
              [0, 100],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${cardScale}) rotate(${cardRotation}deg) translateY(${cardY}px)`,
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  borderRadius: 16,
                  padding: "0 35px 30px 35px",
                  border: `2px solid ${movie.color}`,
                  minWidth: 200,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 0 ${20 + glowPulse * 20}px rgba(${
                    movie.color === "#0077B6" ? "0,119,182" :
                    movie.color === "#E63946" ? "230,57,70" :
                    movie.color === "#6A994E" ? "106,153,78" :
                    movie.color === "#9B5DE5" ? "155,93,229" :
                    "244,162,97"
                  }, ${glowPulse})`,
                }}
              >
                {/* Color bar at top */}
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: 3,
                    backgroundColor: movie.color,
                    marginBottom: 25,
                    borderRadius: "0 0 2px 2px",
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: movie.color,
                    marginBottom: 5,
                  }}
                >
                  {movie.year}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  {movie.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
