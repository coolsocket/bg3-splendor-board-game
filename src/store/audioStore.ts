import { create } from 'zustand';
import { Howl, Howler } from 'howler';

export type AudioAction = 
  | 'gem_clink' 
  | 'token_drop' 
  | 'card_reserve' 
  | 'card_buy' 
  | 'patron_visit' 
  | 'turn_start' 
  | 'victory_ascension' 
  | 'error_thud';

interface AudioState {
  globalVolume: number;
  bgmVolume: number;
  isMuted: boolean;
  bgmPlaylist: string[];
  currentBgmIndex: number;
  setVolume: (volume: number) => void;
  setBgmVolume: (volume: number) => void;
  toggleMute: () => void;
  playAudio: (action: AudioAction) => void;
  playBgm: () => void;
  pauseBgm: () => void;
  _getBgmHowl: () => Howl | null;
}

const GCS_BASE = 'https://storage.googleapis.com/bg3-splendor-audio-assets/audio';

const audioMap: Record<AudioAction, string> = {
  'gem_clink': `${GCS_BASE}/gem_clink.mp3`,
  'token_drop': `${GCS_BASE}/token_drop.mp3`,
  'card_reserve': `${GCS_BASE}/card_reserve.mp3`,
  'card_buy': `${GCS_BASE}/card_buy.mp3`,
  'patron_visit': `${GCS_BASE}/patron_visit.mp3`,
  'turn_start': `${GCS_BASE}/turn_start.mp3`,
  'victory_ascension': `${GCS_BASE}/victory_ascension.mp3`,
  'error_thud': `${GCS_BASE}/error_thud.mp3`,
};

const debugLog = (msg: string, isError = false) => {
  if (isError) {
    console.error(`[AudioEngine] ${msg}`);
  } else {
    console.log(`[AudioEngine] ${msg}`);
  }
};

const createHowl = (src: string, sprite?: any) => {
  return new Howl({
    src: [src],
    preload: true,
    sprite,
    onload: () => debugLog(`Loaded: ${src}`),
    onloaderror: (_id, err) => debugLog(`Load Error [${src}]: ${err}`, true),
    onplayerror: (_id, err) => {
      debugLog(`Play Error [${src}]: ${err}`, true);
      const howl = Howler.ctx ? Howler : null;
      if (howl) howl.ctx.resume();
    },
  });
};

const audioSprites: Record<AudioAction, Howl> | Record<string, never> = typeof window !== 'undefined' ? {
  'gem_clink': createHowl(audioMap['gem_clink']),
  'token_drop': createHowl(audioMap['token_drop']),
  'error_thud': createHowl(audioMap['error_thud']),
  'card_reserve': createHowl(audioMap['card_reserve']),
  'card_buy': createHowl(audioMap['card_buy']),
  'turn_start': createHowl(audioMap['turn_start']),
  'patron_visit': createHowl(audioMap['patron_visit']),
  'victory_ascension': createHowl(audioMap['victory_ascension'])
} : {};

const BGM_PLAYLIST = [
  `${GCS_BASE}/bgm_down_by_the_river.mp3`,
  `${GCS_BASE}/bgm_main.mp3`,
  `${GCS_BASE}/bgm_raphael.mp3`,
  `${GCS_BASE}/bgm_i_want_to_live.mp3`,
  `${GCS_BASE}/bgm_nightsong.mp3`,
  `${GCS_BASE}/bgm_gather_your_allies.mp3`,
  `${GCS_BASE}/bgm_main.mp3`, // Repetitions for now to reach 10
  `${GCS_BASE}/bgm_i_want_to_live.mp3`,
  `${GCS_BASE}/bgm_nightsong.mp3`,
  `${GCS_BASE}/bgm_raphael.mp3`
];

let bgmHowl: Howl | null = null;

export const useAudioStore = create<AudioState>((set, get) => ({
  globalVolume: 0.5,
  bgmVolume: 0.3,
  isMuted: false,
  bgmPlaylist: BGM_PLAYLIST,
  currentBgmIndex: 0,
  
  setVolume: (volume: number) => {
    const newVol = Math.max(0, Math.min(1, volume));
    set({ globalVolume: newVol });
    Howler.volume(newVol);
  },
  
  setBgmVolume: (volume: number) => {
    const newVol = Math.max(0, Math.min(1, volume));
    set({ bgmVolume: newVol });
    if (bgmHowl) {
      bgmHowl.volume(newVol);
    }
  },
  
  toggleMute: () => {
    set((state) => {
      const newMuted = !state.isMuted;
      Howler.mute(newMuted);
      return { isMuted: newMuted };
    });
  },

  playBgm: () => {
    const { bgmVolume, isMuted, bgmPlaylist, currentBgmIndex } = get();
    if (typeof window === 'undefined') return;

    if (!bgmHowl) {
      const trackSrc = bgmPlaylist[currentBgmIndex];
      bgmHowl = new Howl({
        src: [trackSrc],
        html5: true,
        loop: false, // Don't loop, we want to play the next track on end
        volume: bgmVolume,
        preload: true,
        onend: () => {
          // Play the next track
          const nextIndex = (get().currentBgmIndex + 1) % bgmPlaylist.length;
          set({ currentBgmIndex: nextIndex });
          bgmHowl = null; // Reset so the next playBgm call instantiates the new track
          get().playBgm();
        }
      });
    }

    if (!bgmHowl.playing()) {
      bgmHowl.play();
    }
    Howler.mute(isMuted);
  },

  pauseBgm: () => {
    if (bgmHowl && bgmHowl.playing()) {
      bgmHowl.pause();
    }
  },

  playAudio: (action: AudioAction) => {
    const { isMuted } = get();
    if (isMuted || typeof window === 'undefined') return;

    const howl = audioSprites[action as keyof typeof audioSprites];
    if (howl) {
      howl.play();
    }
  },
  
  _getBgmHowl: () => bgmHowl,
}));

if (typeof window !== 'undefined') {
  (window as any).__ZUSTAND_AUDIO_STORE__ = useAudioStore;
}
