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
  isShuffle: boolean;
  isBgmPlaying: boolean;
  setVolume: (volume: number) => void;
  setBgmVolume: (volume: number) => void;
  toggleMute: () => void;
  playAudio: (action: AudioAction) => void;
  playBgm: () => void;
  pauseBgm: () => void;
  nextBgm: () => void;
  prevBgm: () => void;
  setShuffle: (shuffle: boolean) => void;
  getCurrentTrackName: () => string;
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
  `${GCS_BASE}/bgm_song_of_baldur.mp3`,
  `${GCS_BASE}/bgm_the_power.mp3`,
  `${GCS_BASE}/bgm_combat.mp3`
];

let bgmHowl: Howl | null = null;
let bgmDurationTimeout: any = null;

export const useAudioStore = create<AudioState>((set, get) => {
  // Fisher-Yates shuffle helper for initial playlist
  const initialShuffle = (playlist: string[]) => {
    const shuffled = [...playlist];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return {
    globalVolume: 0.5,
    bgmVolume: 0.3,
    isMuted: false,
    bgmPlaylist: initialShuffle(BGM_PLAYLIST),
    currentBgmIndex: 0,
    isShuffle: true,
    isBgmPlaying: false,
  
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
      debugLog(`Initializing track index ${currentBgmIndex}: ${trackSrc}`);
      
      bgmHowl = new Howl({
        src: [trackSrc],
        html5: true,
        loop: false, // Don't loop, we want to play the next track on end
        volume: bgmVolume,
        preload: true,
        onend: () => {
          debugLog(`Track ended naturally: ${trackSrc}`);
          get().nextBgm();
        },
        onloaderror: (_id, err) => {
          debugLog(`LOAD ERROR on track ${trackSrc}: ${err}. Skipping track...`, true);
          bgmHowl = null;
          get().nextBgm();
        },
        onplayerror: (_id, err) => {
          debugLog(`PLAY ERROR on track ${trackSrc}: ${err}. Skipping track...`, true);
          bgmHowl = null;
          get().nextBgm();
        }
      });
    }

    if (!bgmHowl.playing()) {
      bgmHowl.play();
    }
    set({ isBgmPlaying: true });
    Howler.mute(isMuted);

    // Dynamic duration cap: restrict any single track to 5 minutes max for snappy pacing
    if (bgmDurationTimeout) clearTimeout(bgmDurationTimeout);
    bgmDurationTimeout = setTimeout(() => {
      if (bgmHowl && get().isBgmPlaying) {
        debugLog('BGM track exceeded 5-minute limit. Smoothly fading out to next track...');
        const currentVol = get().bgmVolume;
        bgmHowl.fade(currentVol, 0, 3000);
        setTimeout(() => {
          get().nextBgm();
        }, 3100);
      }
    }, 300000); // 300 seconds (5 minutes)
  },

  pauseBgm: () => {
    if (bgmDurationTimeout) {
      clearTimeout(bgmDurationTimeout);
      bgmDurationTimeout = null;
    }
    if (bgmHowl && bgmHowl.playing()) {
      bgmHowl.pause();
    }
    set({ isBgmPlaying: false });
  },

  nextBgm: () => {
    if (bgmDurationTimeout) {
      clearTimeout(bgmDurationTimeout);
      bgmDurationTimeout = null;
    }
    if (bgmHowl) {
      bgmHowl.stop();
      bgmHowl = null;
    }

    const { bgmPlaylist, currentBgmIndex } = get();
    const nextIndex = (currentBgmIndex + 1) % bgmPlaylist.length;
    set({ currentBgmIndex: nextIndex, isBgmPlaying: false });
    debugLog(`Manual skip / Auto advance: index changed to ${nextIndex}`);
    
    get().playBgm();
  },

  prevBgm: () => {
    if (bgmDurationTimeout) {
      clearTimeout(bgmDurationTimeout);
      bgmDurationTimeout = null;
    }
    if (bgmHowl) {
      bgmHowl.stop();
      bgmHowl = null;
    }

    const { bgmPlaylist, currentBgmIndex } = get();
    const prevIndex = (currentBgmIndex - 1 + bgmPlaylist.length) % bgmPlaylist.length;
    set({ currentBgmIndex: prevIndex, isBgmPlaying: false });
    debugLog(`Manual previous: index changed to ${prevIndex}`);
    
    get().playBgm();
  },

  setShuffle: (shuffle: boolean) => {
    if (typeof window === 'undefined') return;
    const rawPlaylist = [...BGM_PLAYLIST];
    
    if (shuffle) {
      debugLog('Enabling shuffle mode. Shuffling playlist...');
      const currentTrack = get().bgmPlaylist[get().currentBgmIndex];
      
      // Shuffle BGM playlist (Fisher-Yates)
      const shuffled = [...rawPlaylist];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Relocate current track to match its index or put it at 0 to avoid abrupt cuts
      const newIndex = shuffled.indexOf(currentTrack);
      set({
        isShuffle: true,
        bgmPlaylist: shuffled,
        currentBgmIndex: newIndex >= 0 ? newIndex : 0
      });
    } else {
      debugLog('Disabling shuffle mode. Restoring original playlist...');
      const currentTrack = get().bgmPlaylist[get().currentBgmIndex];
      const originalIndex = rawPlaylist.indexOf(currentTrack);
      
      set({
        isShuffle: false,
        bgmPlaylist: rawPlaylist,
        currentBgmIndex: originalIndex >= 0 ? originalIndex : 0
      });
    }
  },

  getCurrentTrackName: () => {
    const { bgmPlaylist, currentBgmIndex } = get();
    const fileUrl = bgmPlaylist[currentBgmIndex];
    if (!fileUrl) return 'Silent';
    
    const parts = fileUrl.split('/');
    const filename = parts[parts.length - 1] || '';
    
    return filename
      .replace('bgm_', '')
      .replace('.mp3', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
  };
})

if (typeof window !== 'undefined') {
  (window as any).__ZUSTAND_AUDIO_STORE__ = useAudioStore;
}
