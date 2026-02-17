import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const WaltDisneyScene: React.FC = () => {
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

  const castleOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mickeySilhouetteScale = spring({
    frame: frame - Math.round(fps * 2),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0d1b2a 0%, #1b2838 50%, #2a1a3a 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Castle silhouette background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 300,
          opacity: castleOpacity,
          color: "#FFD700",
        }}
      >
        &#9733;
      </div>

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
            fontFamily: "Georgia, serif",
            color: "#FFD700",
            transform: `scale(${yearScale})`,
            textShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
          }}
        >
          1923
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
          Walt Disney founds
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#87CEEB",
            marginTop: 10,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
          }}
        >
          The Disney Brothers Studio
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 28,
            color: "#c0c0c0",
            opacity: textOpacity,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          From a small garage in Hollywood, Walt Disney
          began a journey that would change entertainment forever
        </div>

        {/* Mickey ears silhouette */}
        <div
          style={{
            marginTop: 40,
            transform: `scale(${Math.max(0, mickeySilhouetteScale)})`,
            display: "flex",
            alignItems: "center",
            gap: -10,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#FFD700",
              marginRight: -5,
            }}
          />
          <div
            style={{
              width: 55,
              height: 55,
              borderRadius: "50%",
              backgroundColor: "#FFD700",
            }}
          />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#FFD700",
              marginLeft: -5,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
