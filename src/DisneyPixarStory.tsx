import React from "react";
import {
  AbsoluteFill,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import { TitleScene } from "./scenes/TitleScene";
import { WaltDisneyScene } from "./scenes/WaltDisneyScene";
import { PixarOriginsScene } from "./scenes/PixarOriginsScene";
import { ToyStoryScene } from "./scenes/ToyStoryScene";
import { GoldenEraScene } from "./scenes/GoldenEraScene";
import { MergerScene } from "./scenes/MergerScene";
import { LegacyScene } from "./scenes/LegacyScene";

export const DisneyPixarStory: React.FC = () => {
  const { fps } = useVideoConfig();

  const transitionDuration = Math.round(fps * 0.5);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      <TransitionSeries>
        {/* Scene 1: Title (0-4s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4)}>
          <TitleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 2: Walt Disney Origins (4-8.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <WaltDisneyScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 3: Pixar Origins (8.5-13s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <PixarOriginsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 4: Toy Story (13-17.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <ToyStoryScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 5: Golden Era (17.5-22s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <GoldenEraScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 6: The Merger (22-26s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4)}>
          <MergerScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 7: Legacy (26-30s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4)}>
          <LegacyScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
