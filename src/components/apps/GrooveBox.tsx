import { useRef } from 'react';
import { useIframeVolume } from '../utils/useIframeVolume';

const GROOVE_BOX_URL = 'https://kylegothman.github.io/groove-box/';

export default function DisGrooveBox() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // The groove box listens for the site volume (see docs/embedded-audio.md).
  useIframeVolume(iframeRef, new URL(GROOVE_BOX_URL).origin);

  return (
    <div className="h-full w-full flex flex-col bg-ub-cool-grey">
      <iframe
        ref={iframeRef}
        src={GROOVE_BOX_URL}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        title="Groove Box"
        className="w-full h-full bg-ub-cool-grey"
      />
    </div>
  );
}
