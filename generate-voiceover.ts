import { mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";

const VOICE_ID = "ErXwobaYiN019PkySvjV"; // "Antoni" - confident, energetic male voice

const SCENES = [
  {
    id: "01-title",
    text: "What happens when a garage dream meets cutting-edge technology? You get the greatest animation empire the world has ever seen. This is Disney and Pixar.",
  },
  {
    id: "02-walt-disney",
    text: "1923. A young Walt Disney opens a tiny studio in a Hollywood garage. No budget. No backing. Just a wild belief that drawings could make the world feel something. And he was absolutely right.",
  },
  {
    id: "03-pixar-origins",
    text: "Fast forward to 1986. Steve Jobs bets big, buying Pixar from Lucasfilm's computer graphics division. A scrappy team of engineers and artists with one audacious goal: blow up everything we know about animation.",
  },
  {
    id: "04-toy-story",
    text: "Then 1995 hits, and everything changes. Toy Story drops as the first fully computer-animated feature film ever made. Critics love it. Audiences lose their minds. A brand new era of filmmaking is born.",
  },
  {
    id: "05-golden-era",
    text: "And they just kept winning. Finding Nemo. The Incredibles. Ratatouille. WALL-E. Up. Banger after banger. A golden era that nobody could touch.",
  },
  {
    id: "06-merger",
    text: "2006. Disney makes the power move, acquiring Pixar for seven point four billion dollars. Two animation giants, now one unstoppable force.",
  },
  {
    id: "07-legacy",
    text: "The result? 23 Academy Awards. Over 28 feature films. More than 19 billion dollars at the box office. Not just a legacy. A dynasty built on dreams, guts, and innovation.",
  },
];

function generateVoiceover(sceneId: string, text: string): void {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY is not set. Add it to your .env file.",
    );
  }

  console.log(`Generating voiceover for scene: ${sceneId}`);

  const outputPath = `public/voiceover/${sceneId}.mp3`;
  const body = JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.45,
      similarity_boost: 0.75,
      style: 0.4,
    },
  });

  execSync(
    `curl -s -o "${outputPath}" -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" ` +
      `-H "xi-api-key: ${apiKey}" ` +
      `-H "Content-Type: application/json" ` +
      `-H "Accept: audio/mpeg" ` +
      `-d '${body.replace(/'/g, "'\\''")}'`,
    { stdio: "pipe" },
  );

  const { statSync } = require("fs");
  const size = statSync(outputPath).size;
  console.log(`  Saved: ${outputPath} (${size} bytes)`);
}

function main(): void {
  if (!existsSync("public/voiceover")) {
    mkdirSync("public/voiceover", { recursive: true });
  }

  for (const scene of SCENES) {
    generateVoiceover(scene.id, scene.text);
  }

  console.log("\nAll voiceover files generated successfully!");
}

main();
