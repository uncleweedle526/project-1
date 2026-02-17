import React from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
// clockWipe has a path-parsing bug in this version, using wipe instead
import { LightLeak } from "@remotion/light-leaks";

import { TitleScene } from "./scenes/TitleScene";
import { WaltDisneyScene } from "./scenes/WaltDisneyScene";
import { PixarOriginsScene } from "./scenes/PixarOriginsScene";
import { ToyStoryScene } from "./scenes/ToyStoryScene";
import { GoldenEraScene } from "./scenes/GoldenEraScene";
import { MergerScene } from "./scenes/MergerScene";
import { LegacyScene } from "./scenes/LegacyScene";

// Scene voiceover timing: each VO starts shortly after the scene begins
const VOICEOVER_FILES = [
  { file: "voiceover/01-title.mp3", startSec: 0.5 },
  { file: "voiceover/02-walt-disney.mp3", startSec: 4.0 },
  { file: "voiceover/03-pixar-origins.mp3", startSec: 8.5 },
  { file: "voiceover/04-toy-story.mp3", startSec: 13.0 },
  { file: "voiceover/05-golden-era.mp3", startSec: 17.5 },
  { file: "voiceover/06-merger.mp3", startSec: 22.0 },
  { file: "voiceover/07-legacy.mp3", startSec: 26.0 },
];

export interface DisneyPixarStoryProps {
  hasVoiceover?: boolean;
}

export const DisneyPixarStory: React.FC<DisneyPixarStoryProps> = ({
  hasVoiceover = false,
}) => {
  const { fps } = useVideoConfig();

  const transitionDuration = Math.round(fps * 0.5);

  // Background music volume: fade in over 1s, duck to 0.15 when voiceover plays
  const musicVolume = (f: number) => {
    const baseVolume = hasVoiceover ? 0.15 : 0.35;
    return interpolate(f, [0, fps * 1], [0, baseVolume], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      {/* Background music - loops and fades in */}
      <Audio
        src={staticFile("music/ambient-bg.wav")}
        volume={musicVolume}
        loop
      />

      {/* Voiceover tracks - each starts at the scene's timestamp */}
      {hasVoiceover &&
        VOICEOVER_FILES.map((vo, i) => (
          <Sequence key={i} from={Math.round(vo.startSec * fps)}>
            <Audio src={staticFile(vo.file)} volume={0.9} />
          </Sequence>
        ))}

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

        {/* Light leak overlay between scenes 2 and 3 */}
        <TransitionSeries.Overlay durationInFrames={Math.round(fps * 0.8)}>
          <LightLeak seed={3} hueShift={40} />
        </TransitionSeries.Overlay>

        {/* Scene 3: Pixar Origins (8.5-13s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <PixarOriginsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 4: Toy Story (13-17.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <ToyStoryScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: transitionDuration })}
        />

        {/* Scene 5: Golden Era (17.5-22s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(fps * 4.5)}>
          <GoldenEraScene />
        </TransitionSeries.Sequence>

        {/* Light leak overlay between scenes 5 and 6 */}
        <TransitionSeries.Overlay durationInFrames={Math.round(fps * 0.8)}>
          <LightLeak seed={7} hueShift={240} />
        </TransitionSeries.Overlay>

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
