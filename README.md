# Frameforge

Frameforge is a browser-based video-to-ASCII converter built with Next.js. It allows you to upload a video, preview it as live ASCII art, and export the current frame as a text file.

## Overview

Frameforge turns a normal video into stylized ASCII output directly in the browser. The app reads the video using the browser's media APIs, renders frames to a canvas, converts the pixel data into text characters, and displays the result in real time.

## Features

- Upload local video files directly in the browser
- Convert frames into ASCII in real time
- Adjust output width and playback frame rate
- Switch between multiple glyph styles
- Invert luminance for darker or lighter output
- Play, pause, and scrub through the video timeline
- Export the current frame as a `.txt` file
- Run entirely on the client side with no server-side media processing

## Tech Stack

- Next.js
- React
- TypeScript
- HTML5 Video API
- Canvas API

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

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

## How It Works

The app uses the browser's video element and canvas rendering pipeline to sample frames from uploaded footage. Each sampled frame is converted into grayscale pixel values, mapped to ASCII characters, and rendered as a textual representation.

## Notes

This project processes the video entirely on the client side using the browser's video and canvas APIs. Files are not uploaded to any external server.

## Repository

https://github.com/khalidsahalSYS/Video-to-ASCII-converter
