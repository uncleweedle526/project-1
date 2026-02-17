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

  // Year entrance with overshoot
  const yearSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const yearScale = Math.max(0, yearSpring);
  const yearRotate = interpolate(yearSpring, [0, 1], [-8, 0]);

  // Text reveal with stagger
  const line1Opacity = interpolate(frame, [fps * 0.4, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line1Y = interpolate(frame, [fps * 0.4, fps * 0.9], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const line2Opacity = interpolate(frame, [fps * 0.6, fps * 1.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Y = interpolate(frame, [fps * 0.6, fps * 1.1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const descOpacity = interpolate(frame, [fps * 1.0, fps * 1.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY = interpolate(frame, [fps * 1.0, fps * 1.6], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Castle star grows and glows
  const castleOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const castleScale = interpolate(frame, [fps * 1.2, fps * 2.5], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const castleGlow = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.1, 0.3]
  );

  // Mickey ears with bounce
  const mickeySilhouetteScale = spring({
    frame: frame - Math.round(fps * 1.8),
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Floating golden particles
  const particles = Array.from({ length: 25 }, (_, i) => {
    const baseX = (i * 41.7 + 13) % 100;
    const speed = 0.015 + (i % 7) * 0.004;
    const yOffset = ((i * 67.3 + 29) % 80) + 10;
    const floatY = yOffset + Math.sin(frame * speed + i * 2.1) * 8;
    const floatX = baseX + Math.cos(frame * speed * 0.7 + i) * 2;
    const pOpacity = interpolate(
      Math.sin(frame * 0.07 + i * 1.3),
      [-1, 1],
      [0.05, 0.35]
    );
    const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const size = 2 + (i % 4) * 1.5;
    return { x: floatX, y: floatY, opacity: pOpacity * fadeIn, size };
  });

  // Animated decorative lines
  const lineWidth = interpolate(frame, [fps * 1.4, fps * 2.2], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Film strip at edges
  const filmStripOffset = frame * 1.5;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0d1b2a 0%, #15243a 40%, #1b2838 70%, #2a1a3a 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        overflow: "hidden",
      }}
    >
      {/* Film strip borders */}
      {[0, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            [side === 0 ? "left" : "right"]: 0,
            top: 0,
            width: 50,
            height: "100%",
            backgroundColor: "rgba(20, 15, 10, 0.8)",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 20 }, (_, j) => (
            <div
              key={j}
              style={{
                position: "absolute",
                left: 10,
                top: j * 60 - (filmStripOffset % 60),
                width: 30,
                height: 20,
                borderRadius: 4,
                backgroundColor: "rgba(255, 215, 0, 0.08)",
                border: "1px solid rgba(255, 215, 0, 0.12)",
              }}
            />
          ))}
        </div>
      ))}

      {/* Floating golden particles */}
      {particles.map((p, i) => (
        <div
          key={`p-${i}`}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "#FFD700",
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px rgba(255, 215, 0, 0.3)`,
          }}
        />
      ))}

      {/* Castle star background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${castleScale})`,
          fontSize: 350,
          opacity: castleOpacity,
          color: "#FFD700",
          filter: `drop-shadow(0 0 60px rgba(255, 215, 0, ${castleGlow}))`,
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
            transform: `scale(${yearScale}) rotate(${yearRotate}deg)`,
            textShadow:
              "0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.2)",
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
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
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
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            textAlign: "center",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            textShadow: "0 0 30px rgba(135, 206, 235, 0.3)",
          }}
        >
          The Disney Brothers Studio
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 1.5,
            background:
              "linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)",
            marginTop: 20,
          }}
        />

        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#c0c0c0",
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          From a small garage in Hollywood, Walt Disney
          began a journey that would change entertainment forever
        </div>

        {/* Mickey ears silhouette with glow */}
        <div
          style={{
            marginTop: 35,
            transform: `scale(${Math.max(0, mickeySilhouetteScale)})`,
            display: "flex",
            alignItems: "center",
            filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))",
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
