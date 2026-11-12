import { useRef } from 'react';
import { useIframeVolume } from '../utils/useIframeVolume';

/** The game is a single-file Three.js build deployed from its own repo; it is embedded as-is. */
const GAME_URL = 'https://kylegothman.github.io/yukons-gold/';

export default function DisYukonsGold() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Forwards the site volume; the game applies it once it has the receiver (docs/embedded-audio.md).
  useIframeVolume(iframeRef, new URL(GAME_URL).origin);

  return (
    <div className="h-full w-full bg-black">
      <iframe
        ref={iframeRef}
        src={GAME_URL}
        title="Yukon's Gold"
        className="block h-full w-full"
        frameBorder="0"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
