# Frameforge — Video to ASCII

A small browser-based studio for turning video into animated ASCII art. Built with Next.js; video decoding and frame conversion happen locally in your browser, so clips are never uploaded.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), choose a browser-supported video, and play it to see the live ASCII preview. Adjust character width, playback sampling rate, glyph set, and luminance inversion. Export the current frame as a `.txt` file.

## Build

```bash
npm run build
```

The project is configured for static export with Next.js. The converter uses the browser's video and canvas APIs and does not require a server-side media pipeline.
