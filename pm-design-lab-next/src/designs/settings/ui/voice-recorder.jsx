"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, Trash2 } from "lucide-react";
import { Button } from "@/designs/settings/ui/button";
/** How often (ms) the microphone level is sampled while recording; one waveform bar per sample. */
const SAMPLE_MS = 100;
/** Each bar is 2px wide with a 3px gap. */
const BAR_STEP = 5;
/** 16.4 → "0:16". */
const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
/**
 * Record a greeting with the microphone, following the design's three states:
 * a Record button; while recording, a stop button, a live green waveform and a
 * timer; afterwards, play/pause with a waveform that fills green as it plays,
 * the length, and a bin to delete it.
 */
export function VoiceRecorder({ value, onChange }) {
  const [recording, setRecording] = useState(false);
  const [levels, setLevels] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const recorderRef = useRef(null);
  /** Stops everything without keeping the recording (used if the page is left mid-recording). */
  const discard = useRef(null);
  // Release the microphone if the component goes away mid-recording.
  useEffect(() => () => discard.current?.(), []);
  const start = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording isn’t supported in this browser.");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access is blocked. Allow it in your browser to record.");
      return;
    }
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    const samples = [];
    const startedAt = Date.now();
    // Measure loudness for the waveform.
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    audioContext.createMediaStreamSource(stream).connect(analyser);
    const buffer = new Uint8Array(analyser.fftSize);
    const timer = setInterval(() => {
      analyser.getByteTimeDomainData(buffer);
      let sum = 0;
      for (const v of buffer) sum += ((v - 128) / 128) ** 2;
      // Boost quiet speech so the bars are visible, capped at 1.
      samples.push(Math.min(1, Math.sqrt(sum / buffer.length) * 4));
      setLevels([...samples]);
      setElapsed((Date.now() - startedAt) / 1000);
    }, SAMPLE_MS);
    const release = () => {
      clearInterval(timer);
      stream.getTracks().forEach((t) => t.stop());
      void audioContext.close();
      recorderRef.current = null;
      discard.current = null;
    };
    discard.current = () => {
      recorder.onstop = null;
      if (recorder.state !== "inactive") recorder.stop();
      release();
    };
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      release();
      setRecording(false);
      onChange({
        blob: new Blob(chunks, { type: recorder.mimeType || "audio/webm" }),
        duration: (Date.now() - startedAt) / 1000,
        levels: samples,
      });
    };
    recorderRef.current = recorder;
    recorder.start();
    setLevels([]);
    setElapsed(0);
    setRecording(true);
  };
  // Stopping fires the recorder's onstop above, which keeps the recording.
  const stop = () => recorderRef.current?.stop();
  if (recording) {
    return (
      <Box>
        <button
          type="button"
          onClick={stop}
          aria-label="Stop recording"
          className="grid size-8 shrink-0 place-items-center rounded-md text-gray-900 hover:bg-gray-50"
        >
          <Pause className="size-6" strokeWidth={1.6} />
        </button>
        <Waveform levels={levels} live />
        <TimeChip seconds={elapsed} label="Recording time" />
      </Box>
    );
  }
  if (value) return <Playback recording={value} onDelete={() => onChange(null)} />;
  return (
    <div>
      <div className="flex justify-end">
        <Button className="h-10 px-4" onClick={start}>
          <Mic className="size-[18px]" strokeWidth={1.6} />
          Record
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-right text-[13px] text-error-500">
          {error}
        </p>
      )}
    </div>
  );
}
/** Play back a finished recording; the waveform fills green as it plays. */
function Playback({ recording, onDelete }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  // Point the player at a local URL for the recording; freed when it changes or is deleted.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = URL.createObjectURL(recording.blob);
    audio.src = url;
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      URL.revokeObjectURL(url);
    };
  }, [recording.blob]);
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };
  return (
    <Box>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause greeting" : "Play greeting"}
        className="grid size-8 shrink-0 place-items-center rounded-md text-gray-900 hover:bg-gray-50"
      >
        {playing ? (
          <Pause className="size-6" strokeWidth={1.6} />
        ) : (
          <Play className="size-6" strokeWidth={1.6} strokeLinejoin="round" />
        )}
      </button>
      <Waveform levels={recording.levels} progress={recording.duration ? position / recording.duration : 0} />
      <TimeChip seconds={playing ? position : recording.duration} label={playing ? "Played" : "Length"} />
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete recording"
        className="grid size-8 shrink-0 place-items-center rounded-md text-gray-900 hover:bg-gray-50"
      >
        <Trash2 className="size-5" strokeWidth={1.6} />
      </button>
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setPosition(0);
        }}
      />
    </Box>
  );
}
function Box({ children }) {
  return (
    <div className="flex h-10 items-center gap-3 rounded-lg border border-gray-200 bg-white pr-2 pl-2">
      {children}
    </div>
  );
}
function TimeChip({ seconds, label }) {
  return (
    <span
      aria-label={`${label}: ${formatTime(seconds)}`}
      className="shrink-0 rounded-full border border-gray-200 px-2 py-0.5 text-[13px] text-gray-900 tabular-nums"
    >
      {formatTime(seconds)}
    </span>
  );
}
/**
 * Vertical bars for loudness. Live: the newest bars, all green, growing from the
 * left. Playback: the whole recording squeezed to fit, green up to `progress`.
 */
function Waveform({ levels, live = false, progress = 0 }) {
  const ref = useRef(null);
  const [slots, setSlots] = useState(60);
  // How many bars fit in the available width.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSlots(Math.max(1, Math.floor(entry.contentRect.width / BAR_STEP))),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  let bars;
  if (live) {
    bars = levels.slice(-slots);
  } else {
    // Squeeze (or stretch) the samples into the available bars, keeping each group's peak.
    const count = Math.min(slots, Math.max(levels.length, 1) * 4);
    bars = Array.from({ length: count }, (_, i) => {
      const from = Math.floor((i / count) * levels.length);
      const to = Math.max(from + 1, Math.floor(((i + 1) / count) * levels.length));
      return Math.max(0, ...levels.slice(from, to));
    });
  }
  const played = Math.round(progress * bars.length);
  return (
    <div ref={ref} className="flex h-6 min-w-0 flex-1 items-center gap-[3px] overflow-hidden" aria-hidden>
      {bars.map((level, i) => (
        <span
          key={i}
          className={`w-[2px] shrink-0 rounded-full ${live || i < played ? "bg-success-500" : "bg-[#e4e7ec]"}`}
          style={{ height: `${Math.max(4, Math.round(level * 24))}px` }}
        />
      ))}
    </div>
  );
}
