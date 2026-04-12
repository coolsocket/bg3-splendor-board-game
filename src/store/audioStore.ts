import { create } from 'zustand';

export type AudioAction = 'buy-card' | 'reserve-card' | 'take-token' | 'take-tadpole';

interface AudioState {
  playAudio: (action: AudioAction) => void;
}

export const useAudioStore = create<AudioState>((_set) => ({
  playAudio: (action) => {
    // For now, we just log the action.
    // In a full implementation, this would load and play the audio file.
    console.log(`[Audio] Playing sound for action: ${action}`);
    
    // Example of how it might look:
    // const audio = new Audio(`/audio/${action}.mp3`);
    // audio.play();
  },
}));
