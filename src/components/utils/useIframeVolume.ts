import { useContext, useEffect, type RefObject } from 'react';
import VolumeContext from './VolumeContext';

export const VOLUME_MESSAGE_TYPE = 'goth-os:volume';

/**
 * Forwards the site volume (navbar slider) to an embedded page.
 *
 * The embedded page opts in by listening for
 * `{ type: 'goth-os:volume', volume: 0..1 }` window messages — see docs/embedded-audio.md.
 * The current level is re-sent whenever the slider moves and each time the iframe (re)loads.
 */
export function useIframeVolume(iframeRef: RefObject<HTMLIFrameElement>, targetOrigin: string): void {
  const { volume } = useContext(VolumeContext);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const send = () => {
      iframe.contentWindow?.postMessage({ type: VOLUME_MESSAGE_TYPE, volume: volume / 100 }, targetOrigin);
    };

    send();
    iframe.addEventListener('load', send);
    return () => iframe.removeEventListener('load', send);
  }, [iframeRef, targetOrigin, volume]);
}
