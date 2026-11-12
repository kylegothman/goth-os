import { useContext, useEffect, useRef, type RefObject } from 'react';
import VolumeContext from './VolumeContext';

export const VOLUME_MESSAGE_TYPE = 'goth-os:volume';

/**
 * Forwards the site volume (navbar slider) to an embedded page.
 *
 * The embedded page opts in by listening for
 * `{ type: 'goth-os:volume', volume: 0..1 }` window messages — see docs/embedded-audio.md.
 * The level is sent each time the iframe finishes loading and whenever the slider moves after that.
 * (Nothing is sent before the first load: until then the frame still holds the initial about:blank
 * document, whose origin never matches `targetOrigin`.)
 */
export function useIframeVolume(iframeRef: RefObject<HTMLIFrameElement>, targetOrigin: string): void {
  const { volume } = useContext(VolumeContext);
  const loadedRef = useRef(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const send = () => {
      iframe.contentWindow?.postMessage({ type: VOLUME_MESSAGE_TYPE, volume: volume / 100 }, targetOrigin);
    };
    const onLoad = () => {
      loadedRef.current = true;
      send();
    };

    if (loadedRef.current) send(); // slider moved after the page loaded
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [iframeRef, targetOrigin, volume]);
}
