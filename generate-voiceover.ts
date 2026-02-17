import { mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // "Rachel" - warm, narrative voice

const SCENES = [
  {
    id: "01-title",
    text: "Disney and Pixar. A story of magic and innovation.",
  },
  {
    id: "02-walt-disney",
    text: "In 1923, Walt Disney founded The Disney Brothers Studio in a small Hollywood garage. From those humble beginnings, he set out to change entertainment forever.",
  },
  {
    id: "03-pixar-origins",
    text: "In 1986, Steve Jobs acquired Pixar from Lucasfilm's computer graphics division. The tiny studio had a bold mission: to revolutionize animation through technology.",
  },
  {
    id: "04-toy-story",
    text: "In 1995, Toy Story became the first fully computer-animated feature film. It proved that CGI could tell heartwarming stories and launched an entirely new era of filmmaking.",
  },
  {
    id: "05-golden-era",
    text: "Then came hit after hit. Finding Nemo. The Incredibles. Ratatouille. WALL-E. Up. A golden era of storytelling.",
  },
  {
    id: "06-merger",
    text: "In 2006, Disney acquired Pixar for seven point four billion dollars, uniting two animation powerhouses into one.",
  },
  {
    id: "07-legacy",
    text: "Together, they have won 23 Academy Awards, produced over 28 feature films, and earned more than 19 billion dollars. A legacy of dreams and innovation.",
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
      stability: 0.6,
      similarity_boost: 0.75,
      style: 0.2,
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
