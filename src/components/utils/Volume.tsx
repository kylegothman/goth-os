import { useContext, type ChangeEvent } from 'react';
import VolumeContext from './VolumeContext';
import { assetPath } from '../../utils/assetPath';

export default function Volume() {
  const { volume, setVolume } = useContext(VolumeContext);

  const handleSound = (e: ChangeEvent<HTMLInputElement>) => {
    const level = Number(e.target.value);
    setVolume(level);
    localStorage.setItem('sound-level', String(level));
  };

  return (
    <div className="w-64 py-1.5 flex items-center justify-center hover:bg-ub-warm-grey hover:bg-opacity-20">
      <div className="w-8">
        <img width="16px" height="16px" src={assetPath('/assets/icons/SVG/headphones.svg')} alt="headphone" />
      </div>
      <input
        type="range"
        className="slider w-2/3"
        name="headphone_range"
        min={0}
        max={100}
        step={1}
        value={volume}
        onChange={handleSound}
      />
    </div>
  );
}
