'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useBLS } from '@/engine/bls/useBLS';

interface BLSCanvasProps {
  onSetStart?: () => void;
  onSetEnd?: (durationSeconds: number) => void;
}

export function BLSCanvas({ onSetStart, onSetEnd }: BLSCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isRunning, start, stop, updateParams, params } = useBLS();
  const [setStartTime, setSetStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Timer tick when running
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    start(canvas);
    setSetStartTime(Date.now());
    setElapsed(0);
    onSetStart?.();
  }, [start, onSetStart]);

  const handleStop = useCallback(() => {
    stop();
    const duration = setStartTime ? Math.round((Date.now() - setStartTime) / 1000) : 0;
    onSetEnd?.(duration);
    setSetStartTime(null);
    setElapsed(0);
  }, [stop, setStartTime, onSetEnd]);

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-3">
      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-[#0d1117]">
        <canvas
          ref={canvasRef}
          className="w-full h-48 block"
          style={{ background: params.background }}
        />
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-600 text-sm">BLS Inactive</span>
          </div>
        )}
        {isRunning && (
          <div className="absolute top-2 right-3 flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400 font-mono">{formatTime(elapsed)}</span>
          </div>
        )}
      </div>

      {/* Start / Stop */}
      <button
        type="button"
        onClick={isRunning ? handleStop : handleStart}
        className={`
          w-full py-3 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
          ${isRunning
            ? 'bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 focus:ring-red-500'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500'
          }
        `}
      >
        {isRunning ? 'Stop BLS Set' : 'Start BLS Set'}
      </button>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        {/* Speed */}
        <div className="col-span-2 space-y-1">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-slate-400">Speed</label>
            <span className="text-xs text-slate-500">{params.speed.toFixed(1)} Hz</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="4.0"
            step="0.1"
            value={params.speed}
            onChange={(e) => updateParams({ speed: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Size */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-slate-400">Size</label>
            <span className="text-xs text-slate-500">{params.size}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="80"
            step="4"
            value={params.size}
            onChange={(e) => updateParams({ size: parseInt(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Shape */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Shape</label>
          <select
            value={params.shape}
            onChange={(e) =>
              updateParams({ shape: e.target.value as typeof params.shape })
            }
            className="w-full rounded bg-slate-800 border border-slate-700 text-sm text-slate-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="circle">Circle</option>
            <option value="diamond">Diamond</option>
            <option value="star">Star</option>
            <option value="butterfly">Butterfly</option>
          </select>
        </div>

        {/* Color */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Color</label>
          <input
            type="color"
            value={params.color}
            onChange={(e) => updateParams({ color: e.target.value })}
            className="w-full h-9 rounded bg-slate-800 border border-slate-700 cursor-pointer px-1"
          />
        </div>

        {/* Audio toggle */}
        <div className="space-y-1 flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`relative w-9 h-5 rounded-full transition-colors ${params.audioEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
              onClick={() => updateParams({ audioEnabled: !params.audioEnabled })}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${params.audioEnabled ? 'translate-x-4' : ''}`}
              />
            </div>
            <span className="text-xs text-slate-400">Audio</span>
          </label>
          {params.audioEnabled && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={params.audioVolume}
              onChange={(e) => updateParams({ audioVolume: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}
