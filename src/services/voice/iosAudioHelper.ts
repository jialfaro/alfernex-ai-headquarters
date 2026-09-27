/**
 * iOS Audio & Speech Synthesis Unlocker
 * iOS Safari WebKit requires user-gesture priming for AudioContext and SpeechSynthesis.
 */

declare global {
  interface Window {
    __iosAudioUnlocked?: boolean;
    __alfernexAudioCtx?: AudioContext;
  }
}

export function unlockIOSAudio(): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Prime and resume Web Audio Context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      if (!window.__alfernexAudioCtx) {
        window.__alfernexAudioCtx = new AudioContextClass();
      }
      if (window.__alfernexAudioCtx.state === 'suspended') {
        window.__alfernexAudioCtx.resume().catch(() => {});
      }

      // Play a short silent buffer to force hardware audio route activation on iOS
      const buffer = window.__alfernexAudioCtx.createBuffer(1, 1, 22050);
      const source = window.__alfernexAudioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(window.__alfernexAudioCtx.destination);
      source.start(0);
    }

    // 2. Prime SpeechSynthesis with an empty utterance during the user gesture
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const dummy = new SpeechSynthesisUtterance(' ');
      dummy.volume = 0.01;
      dummy.rate = 1.0;
      window.speechSynthesis.speak(dummy);
    }

    window.__iosAudioUnlocked = true;
  } catch (err) {
    console.warn('Audio unlock warning:', err);
  }
}

export function speakTextAloud(
  text: string,
  lang: string = 'es-ES',
  rate: number = 1.05,
  pitch: number = 1.0,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    unlockIOSAudio();

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const prefix = lang.slice(0, 2);
      const matched =
        voices.find((v) => v.lang.startsWith(prefix) && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Jorge') || v.name.includes('Paulina') || v.name.includes('Sabina') || v.name.includes('Diego'))) ||
        voices.find((v) => v.lang.startsWith(prefix));
      if (matched) utterance.voice = matched;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech error:', e.error);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('speakTextAloud error:', err);
    onEnd?.();
  }
}
