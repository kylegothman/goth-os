import { useState, useEffect } from 'react';
import { assetPath } from '../utils/assetPath';

interface ASCIIAnimationProps {
  /** Folder under public/ that holds the frames, e.g. "/assets/spheres_output". */
  folderPath: string;
  /** Filename prefix before the zero-padded frame index, e.g. "sphere_ascii". */
  filePrefix: string;
  frameCount: number;
  frameRate: number;
}

export default function ASCIIAnimation({ folderPath, filePrefix, frameCount, frameRate }: ASCIIAnimationProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const urls = Array.from({ length: frameCount }, (_, i) =>
      assetPath(`${folderPath}/${filePrefix}${String(i).padStart(3, '0')}.txt`)
    );

    Promise.all(urls.map((url) => fetch(url).then((res) => res.text())))
      .then((loaded) => {
        if (!cancelled) setFrames(loaded);
      })
      .catch((err) => console.error('Failed to load ASCII animation frames:', err));

    return () => {
      cancelled = true;
    };
  }, [folderPath, filePrefix, frameCount]);

  useEffect(() => {
    if (frames.length === 0) return;
    const id = setInterval(() => {
      setCurrentFrame((frame) => (frame + 1) % frames.length);
    }, 1000 / frameRate);
    return () => clearInterval(id);
  }, [frames, frameRate]);

  return (
    <div
      id="ascii-animation"
      className="flex items-center justify-center w-full h-full absolute top-0 left-0 overflow-hidden text-white"
    >
      <pre style={{ fontFamily: 'monospace' }}>{frames[currentFrame]}</pre>
    </div>
  );
}
