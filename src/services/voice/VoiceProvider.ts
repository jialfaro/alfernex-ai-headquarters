import { VoiceSessionState, VoiceTranscriptItem, VoiceToolExecution } from '../../types/office';

export interface VoiceProviderOptions {
  language?: 'es' | 'en' | 'auto';
  autoStart?: boolean;
}

export interface VoiceProvider {
  connect(agentId: string, options?: VoiceProviderOptions): Promise<void>;
  disconnect(): Promise<void>;
  startListening(): void;
  stopListening(): void;
  interrupt(): void;
  sendText(text: string): Promise<void>;
  muteMic(muted: boolean): void;
  setVolume(vol: number): void;
  setLanguage(lang: 'es' | 'en' | 'auto'): void;
  getState(): VoiceSessionState;

  // Event Listeners
  onStateChange(cb: (state: VoiceSessionState) => void): () => void;
  onTranscript(cb: (transcript: VoiceTranscriptItem) => void): () => void;
  onAudioVolume(cb: (vol: { userVolume: number; agentVolume: number }) => void): () => void;
  onToolExecution(cb: (tool: VoiceToolExecution) => void): () => void;
  onError(cb: (errorMsg: string) => void): () => void;
}
