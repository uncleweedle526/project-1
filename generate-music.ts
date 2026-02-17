import { writeFileSync, mkdirSync, existsSync } from "fs";

// Generate a cinematic ambient soundtrack as a WAV file
// Uses additive synthesis with gentle pads and evolving harmonics

const SAMPLE_RATE = 44100;
const DURATION_SECONDS = 32; // Slightly longer than video for fade-out
const NUM_SAMPLES = SAMPLE_RATE * DURATION_SECONDS;

function generateAmbientMusic(): Float32Array {
  const samples = new Float32Array(NUM_SAMPLES);

  // Chord progression (frequencies in Hz) - cinematic and emotional
  const chords = [
    { start: 0, end: 8, notes: [130.81, 164.81, 196.0, 261.63] }, // C major
    { start: 8, end: 16, notes: [146.83, 174.61, 220.0, 293.66] }, // D minor
    { start: 16, end: 24, notes: [174.61, 220.0, 261.63, 349.23] }, // F major
    { start: 24, end: 32, notes: [130.81, 164.81, 196.0, 261.63] }, // C major resolve
  ];

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;

    // Find current chord
    const chord = chords.find((c) => t >= c.start && t < c.end);
    if (!chord) continue;

    // Crossfade between chords (0.5s fade)
    const chordProgress = t - chord.start;
    const chordDuration = chord.end - chord.start;
    const chordEnvelope =
      Math.min(chordProgress / 0.5, 1) *
      Math.min((chordDuration - chordProgress) / 0.5, 1);

    // Pad synth - warm sine waves with gentle harmonics
    for (const freq of chord.notes) {
      // Fundamental
      sample += Math.sin(2 * Math.PI * freq * t) * 0.08 * chordEnvelope;
      // Soft octave above
      sample +=
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.03 * chordEnvelope;
      // Very soft fifth
      sample +=
        Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.015 * chordEnvelope;
    }

    // Sub bass - deep foundation
    const bassFreq = chord.notes[0] / 2;
    sample += Math.sin(2 * Math.PI * bassFreq * t) * 0.06 * chordEnvelope;

    // Slow LFO for movement
    const lfo = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.1 * t);
    sample *= lfo;

    // Subtle high shimmer
    const shimmer =
      Math.sin(2 * Math.PI * 1046.5 * t + Math.sin(2 * Math.PI * 0.3 * t) * 2) *
      0.008 *
      chordEnvelope;
    sample += shimmer;

    // Global envelope - fade in first 2s, fade out last 2s
    const globalEnv =
      Math.min(t / 2, 1) * Math.min((DURATION_SECONDS - t) / 2, 1);
    sample *= globalEnv;

    // Soft clamp
    samples[i] = Math.max(-0.95, Math.min(0.95, sample));
  }

  return samples;
}

function writeWav(filePath: string, samples: Float32Array): void {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  // RIFF header
  buffer.write("RIFF", offset);
  offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset);
  offset += 4;
  buffer.write("WAVE", offset);
  offset += 4;

  // fmt chunk
  buffer.write("fmt ", offset);
  offset += 4;
  buffer.writeUInt32LE(16, offset);
  offset += 4;
  buffer.writeUInt16LE(1, offset);
  offset += 2; // PCM
  buffer.writeUInt16LE(numChannels, offset);
  offset += 2;
  buffer.writeUInt32LE(SAMPLE_RATE, offset);
  offset += 4;
  buffer.writeUInt32LE(byteRate, offset);
  offset += 4;
  buffer.writeUInt16LE(blockAlign, offset);
  offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset);
  offset += 2;

  // data chunk
  buffer.write("data", offset);
  offset += 4;
  buffer.writeUInt32LE(dataSize, offset);
  offset += 4;

  // Audio samples
  for (let i = 0; i < samples.length; i++) {
    const intSample = Math.max(
      -32768,
      Math.min(32767, Math.round(samples[i] * 32767)),
    );
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  writeFileSync(filePath, buffer);
  console.log(`Saved: ${filePath} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);
}

function main(): void {
  if (!existsSync("public/music")) {
    mkdirSync("public/music", { recursive: true });
  }

  console.log("Generating ambient background music...");
  const samples = generateAmbientMusic();
  writeWav("public/music/ambient-bg.wav", samples);
  console.log("Done!");
}

main();
