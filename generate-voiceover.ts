import { mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";

const VOICE_ID = "ErXwobaYiN019PkySvjV"; // "Antoni" - confident, energetic male voice

const SCENES = [
  {
    id: "01-title",
    text: "19 billion dollars. 23 Oscars. And it all started with a man, a garage, and a mouse. This is the insane true story of Disney and Pixar. And trust me, you don't want to miss how it ends.",
  },
  {
    id: "02-walt-disney",
    text: "1923. Walt Disney has nothing. No money. No connections. Just a tiny studio in a Hollywood garage and a crazy idea: that hand-drawn pictures could make grown adults laugh, cry, and believe in magic. Everyone told him he was out of his mind. But what he built next would change the world forever.",
  },
  {
    id: "03-pixar-origins",
    text: "Now here's where it gets wild. 1986. Steve Jobs, fresh off getting fired from Apple, makes a risky bet. He buys a small computer graphics team from Lucasfilm called Pixar. Nobody takes them seriously. A bunch of nerds trying to make cartoons with computers? But they had a secret weapon that nobody saw coming.",
  },
  {
    id: "04-toy-story",
    text: "1995. Pixar drops Toy Story. The first fully computer-animated movie ever made. And it doesn't just succeed. It explodes. 373 million dollars at the box office. Critics are speechless. Audiences are obsessed. In one single film, Pixar didn't just make a movie. They invented the future of cinema.",
  },
  {
    id: "05-golden-era",
    text: "And then? They went on an absolute tear. Finding Nemo. The Incredibles. Ratatouille. WALL-E. Up. Hit after hit after hit. Every single one a masterpiece. No studio in history had a run like this. But the biggest plot twist? It was still coming.",
  },
  {
    id: "06-merger",
    text: "2006. Disney does the unthinkable. They acquire Pixar for seven point four billion dollars. The old guard and the rebels, now united under one roof. It was the most ambitious bet in entertainment history. And it paid off beyond anyone's wildest imagination.",
  },
  {
    id: "07-legacy",
    text: "23 Academy Awards. Over 28 feature films. More than 19 billion at the box office. From a garage in Hollywood to the most dominant force in animation history. That's not just a success story. That's a dynasty. And they're still just getting started.",
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
