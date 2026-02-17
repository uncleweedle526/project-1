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
  { title: "Finding Nemo", year: "2003", color: "#0077B6" },
  { title: "The Incredibles", year: "2004", color: "#E63946" },
  { title: "Ratatouille", year: "2007", color: "#6A994E" },
  { title: "WALL-E", year: "2008", color: "#9B5DE5" },
  { title: "Up", year: "2009", color: "#F4A261" },
];

export const GoldenEraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerY = interpolate(frame, [0, fps * 0.5], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: "#FFD700",
            textAlign: "center",
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            fontFamily: "Georgia, serif",
            marginBottom: 15,
          }}
        >
          The Golden Era
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#a0aec0",
            opacity: headerOpacity,
            marginBottom: 50,
            letterSpacing: 4,
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
            flexWrap: "wrap",
          }}
        >
          {MOVIES.map((movie, i) => {
            const cardSpring = spring({
              frame: frame - Math.round(fps * 0.5) - i * 6,
              fps,
              config: { damping: 12, stiffness: 100 },
            });

            const cardScale = Math.max(0, cardSpring);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${cardScale})`,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 16,
                  padding: "30px 35px",
                  border: `2px solid ${movie.color}`,
                  minWidth: 200,
                }}
              >
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
