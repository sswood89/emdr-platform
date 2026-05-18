'use client';
import { useRef, useState, useCallback } from 'react';
import { BLSEngine, DEFAULT_BLS_PARAMS } from './BLSEngine';
import type { BLSParameters } from '../../types/clinical';

export function useBLS() {
  const engineRef = useRef<BLSEngine | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [params, setParamsState] = useState<BLSParameters>(DEFAULT_BLS_PARAMS);

  const getOrCreateEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new BLSEngine(params);
    }
    return engineRef.current;
  }, [params]);

  const start = useCallback(
    (canvas: HTMLCanvasElement) => {
      const engine = getOrCreateEngine();
      engine.start(canvas);
      setIsRunning(true);
    },
    [getOrCreateEngine]
  );

  const stop = useCallback(() => {
    engineRef.current?.stop();
    setIsRunning(false);
  }, []);

  const updateParams = useCallback((updates: Partial<BLSParameters>) => {
    setParamsState((prev) => {
      const next = { ...prev, ...updates };
      engineRef.current?.updateParams(updates);
      return next;
    });
  }, []);

  return {
    isRunning,
    start,
    stop,
    updateParams,
    params,
    setParams: updateParams,
  };
}
