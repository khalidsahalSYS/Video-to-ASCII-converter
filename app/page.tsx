"use client";

import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react";

const GLYPH_SETS = {
  standard: "@%#*+=-:. ",
  blocks: "█▓▒░  ",
  minimal: "MWNXK0Okxdolc:,. ",
};

type GlyphStyle = keyof typeof GLYPH_SETS;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastDrawRef = useRef(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [ascii, setAscii] = useState("Drop a video in\nand watch it\nbecome something else.");
  const [width, setWidth] = useState(100);
  const [fps, setFps] = useState(12);
  const [glyphStyle, setGlyphStyle] = useState<GlyphStyle>("standard");
  const [invert, setInvert] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const renderFrame = useCallback((now: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const interval = 1000 / fps;
    if (now - lastDrawRef.current >= interval) {
      lastDrawRef.current = now;
      const columns = width;
      const rows = Math.max(1, Math.round((video.videoHeight / video.videoWidth) * columns * 0.48));
      canvas.width = columns;
      canvas.height = rows;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        context.drawImage(video, 0, 0, columns, rows);
        const pixels = context.getImageData(0, 0, columns, rows).data;
        const glyphs = GLYPH_SETS[glyphStyle];
        let output = "";
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
            const pixel = (y * columns + x) * 4;
            let luminance = (pixels[pixel] * 0.2126 + pixels[pixel + 1] * 0.7152 + pixels[pixel + 2] * 0.0722) / 255;
            if (invert) luminance = 1 - luminance;
            output += glyphs[Math.min(glyphs.length - 1, Math.floor(luminance * glyphs.length))];
          }
          if (y < rows - 1) output += "\n";
        }
        setAscii(output);
      }
      setCurrentTime(video.currentTime);
    }
    if (!video.paused && !video.ended) frameRef.current = requestAnimationFrame(renderFrame);
  }, [fps, glyphStyle, invert, width]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => {
      setPlaying(true);
      lastDrawRef.current = 0;
      frameRef.current = requestAnimationFrame(renderFrame);
    };
    const onPause = () => {
      setPlaying(false);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      renderFrame(performance.now());
    };
    const onEnded = () => setPlaying(false);
    const onMetadata = () => setDuration(video.duration || 0);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("loadedmetadata", onMetadata);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("loadedmetadata", onMetadata);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [renderFrame]);

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  const loadFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("That file doesn’t look like a video. Try MP4, WebM, or another browser-supported format.");
      return;
    }
    setError("");
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setFileName(file.name);
    setAscii("Preparing your frames…");
    setCurrentTime(0);
    setPlaying(false);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => loadFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    loadFile(event.dataTransfer.files[0]);
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;
    if (video.paused) {
      try { await video.play(); } catch { setError("Playback couldn’t start. Try a different video format."); }
    } else video.pause();
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const downloadAscii = () => {
    const blob = new Blob([ascii], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.[^.]+$/, "") || "frameforge"}-${Math.floor(currentTime)}s.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Frameforge home"><span className="brand-mark">F<span>_</span></span><span>frameforge</span></a>
        <div className="topbar-right"><span className="local-badge"><i /> 100% LOCAL</span><a className="github-link" href="https://github.com/khalidsahalSYS/Video-to-ASCII-converter" target="_blank" rel="noreferrer">SOURCE <span>↗</span></a></div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> THE VIDEO-TO-ASCII STUDIO <span className="eyebrow-line" /></div>
        <h1>Motion, remixed<br />in <span>monospace.</span></h1>
        <p className="hero-copy">A new lens for your videos. Drop in a clip and watch every frame<br className="desktop-break" /> redraw itself in characters. No uploads, no noise — just you and the pixels.</p>
      </section>

      <section className="workspace" aria-label="Video to ASCII workspace">
        <div className="workspace-topline"><div><span className="section-index">01</span><span className="section-name">YOUR CANVAS</span></div><span className="live-indicator"><i /> LIVE PREVIEW</span></div>
        <div className="studio-grid">
          <div className="preview-panel">
            <div className="panel-heading"><span>ASCII OUTPUT</span><span className="output-size">{videoUrl ? `${width} COL` : "AWAITING INPUT"}</span></div>
            <div className="ascii-stage" aria-live="polite">
              <pre className={videoUrl ? "ascii-art" : "ascii-art empty-art"}>{ascii}</pre>
              {!videoUrl && <div className="stage-hint"><span className="crosshair">＋</span><span>YOUR VIDEO<br />WILL APPEAR HERE</span></div>}
            </div>
            <div className="preview-footer"><span><i className={videoUrl ? "status-dot active" : "status-dot"} />{videoUrl ? "RENDER ENGINE READY" : "NO SOURCE LOADED"}</span><button className="download-button" onClick={downloadAscii} disabled={!videoUrl}>↓ <span>EXPORT FRAME</span></button></div>
          </div>

          <aside className="controls-panel">
            <div className="panel-heading"><span>CONTROL ROOM</span><span className="control-icon">⌘</span></div>
            <label className={`upload-zone ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
              <input type="file" accept="video/*" onChange={onFileChange} />
              <span className="upload-icon">↥</span><span className="upload-title">{fileName || "Drop your video"}</span><span className="upload-subtitle">or <u>browse files</u> · MP4, MOV, WEBM</span>
              <span className="upload-limit">PROCESSING HAPPENS ON YOUR DEVICE</span>
            </label>
            {error && <p className="error-message" role="alert">{error}</p>}

            <div className="control-group">
              <div className="control-label"><label htmlFor="width">CHARACTER WIDTH</label><span>{width} <small>CHARS</small></span></div>
              <input id="width" className="range-input" type="range" min="48" max="180" step="4" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
              <div className="range-ends"><span>LOW DETAIL</span><span>HIGH DETAIL</span></div>
            </div>
            <div className="control-group fps-group">
              <div className="control-label"><label htmlFor="fps">PLAYBACK RATE</label><span>{fps} <small>FPS</small></span></div>
              <input id="fps" className="range-input" type="range" min="4" max="24" step="1" value={fps} onChange={(event) => setFps(Number(event.target.value))} />
              <div className="range-ends"><span>SMOOTH &amp; LIGHT</span><span>FAST &amp; FLUID</span></div>
            </div>
            <div className="control-group glyph-group">
              <div className="control-label"><span>GLYPH LANGUAGE</span><span className="glyph-preview">@#░</span></div>
              <div className="glyph-options" role="group" aria-label="Glyph style">
                {(["standard", "blocks", "minimal"] as GlyphStyle[]).map((style) => <button key={style} className={glyphStyle === style ? "glyph-option selected" : "glyph-option"} onClick={() => setGlyphStyle(style)}>{style}</button>)}
              </div>
            </div>
            <button className={`invert-toggle ${invert ? "enabled" : ""}`} onClick={() => setInvert(!invert)} aria-pressed={invert}><span className="toggle-copy"><span>INVERT LUMINANCE</span><small>Swap light and dark values</small></span><span className="switch"><i /></span></button>
          </aside>
        </div>

        <div className="transport">
          <button className="play-button" aria-label={playing ? "Pause video" : "Play video"} onClick={togglePlayback} disabled={!videoUrl}>{playing ? "Ⅱ" : "▶"}</button>
          <span className="timecode">{formatTime(currentTime)} <span>/</span> {formatTime(duration)}</span>
          <input className="seek-input" type="range" min="0" max={duration || 1} step="0.01" value={Math.min(currentTime, duration || 1)} onChange={seek} disabled={!videoUrl} aria-label="Seek video" />
          <span className="transport-note">{videoUrl ? "FRAME BY FRAME, YOUR WAY" : "LOAD A CLIP TO BEGIN"}</span>
        </div>
      </section>

      <div className="privacy-note"><span className="lock-icon">◈</span> YOUR FILE NEVER LEAVES YOUR BROWSER <span className="privacy-divider">/</span> BUILT FOR THE LOVE OF PIXELS</div>
      <footer className="footer"><span>FRAMEFORGE <span className="footer-dot">●</span> 2026</span><span>SEE THE WORLD DIFFERENTLY.</span><span>MADE OF CHARACTERS <span className="footer-ascii">░▒▓█</span></span></footer>
      <video ref={videoRef} className="source-video" src={videoUrl || undefined} playsInline preload="metadata" onClick={togglePlayback} />
      <canvas ref={canvasRef} className="source-canvas" />
    </main>
  );
}
