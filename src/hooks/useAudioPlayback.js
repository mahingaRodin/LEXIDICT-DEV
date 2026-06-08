import { useCallback, useEffect, useMemo } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

/**
 * Playback state machine (Activity 3):
 *   idle → loading → playing ⇄ paused → finished → idle
 *   playing | paused → stop → idle
 */
export const PlaybackState = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  ERROR: 'error',
};

function deriveState(status, url) {
  if (!url) return PlaybackState.IDLE;
  if (status?.error) return PlaybackState.ERROR;
  if (!status?.isLoaded) return PlaybackState.LOADING;
  if (status.playing) return PlaybackState.PLAYING;
  if (
    status.didJustFinish ||
    (status.duration > 0 && status.currentTime >= Math.max(0, status.duration - 0.15))
  ) {
    return PlaybackState.FINISHED;
  }
  if (status.currentTime > 0.05) return PlaybackState.PAUSED;
  return PlaybackState.IDLE;
}

export function useAudioPlayback(url) {
  const player = useAudioPlayer(url, { downloadFirst: true });
  const status = useAudioPlayerStatus(player);

  const state = useMemo(() => deriveState(status, url), [status, url]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Stop when source changes or component unmounts.
  useEffect(() => {
    return () => {
      try {
        player.pause();
        player.seekTo(0);
      } catch {
        // player may already be released
      }
    };
  }, [url, player]);

  const play = useCallback(async () => {
    if (state === PlaybackState.FINISHED || state === PlaybackState.IDLE) {
      await player.seekTo(0);
    }
    player.play();
  }, [player, state]);

  const pause = useCallback(() => {
    player.pause();
  }, [player]);

  const stop = useCallback(async () => {
    player.pause();
    await player.seekTo(0);
  }, [player]);

  const toggle = useCallback(async () => {
    if (state === PlaybackState.PLAYING) {
      pause();
    } else {
      await play();
    }
  }, [state, pause, play]);

  return {
    player,
    status,
    state,
    isPlaying: state === PlaybackState.PLAYING,
    isPaused: state === PlaybackState.PAUSED,
    isLoading: state === PlaybackState.LOADING,
    isFinished: state === PlaybackState.FINISHED,
    canStop: state === PlaybackState.PLAYING || state === PlaybackState.PAUSED,
    play,
    pause,
    stop,
    toggle,
  };
}
