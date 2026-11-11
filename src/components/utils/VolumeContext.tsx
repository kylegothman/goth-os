import { createContext } from 'react';

/**
 * Site-wide volume, driven by the slider in the navbar and persisted in localStorage.
 *
 * Anything that makes sound should follow it:
 *  - embedded pages (iframes): `useIframeVolume(ref, origin)` posts the level to the page
 *  - in-page audio (HTMLAudioElement / Web Audio): read `volume / 100` from this context
 */
interface VolumeContextType {
  /** 0–100 */
  volume: number;
  setVolume: (value: number) => void;
}

const VolumeContext = createContext<VolumeContextType>({
  volume: 75,
  setVolume: () => {},
});

export default VolumeContext;
