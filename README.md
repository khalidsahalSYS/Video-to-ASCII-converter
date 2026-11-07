# Frameforge

Frameforge is a browser-based video-to-ASCII converter built with Next.js. It lets you upload a video, preview it as live ASCII art, and export the current frame as a text file.

## Features

- Upload local video files directly in the browser
- Convert frames into ASCII in real time
- Adjust output width and playback frame rate
- Switch between multiple glyph styles
- Invert luminance for darker/lighter output
- Play, pause, and scrub through the video
- Export the current frame as a `.txt` file
- Runs locally in the browser with no server-side media processing

## Tech Stack

- Next.js
- React
- TypeScript
- HTML5 Video + Canvas APIs

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
```

## Notes

This project processes the video entirely on the client side using the browser's video and canvas APIs. Files are not uploaded to any external server.

## Repository

https://github.com/khalidsahalSYS/Video-to-ASCII-converter
