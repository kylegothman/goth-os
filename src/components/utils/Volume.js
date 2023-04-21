import React, { useContext } from 'react';
import VolumeContext from '../utils/VolumeContext';

const Slider = ({ onChange, className, name, value }) => {
  return (
    <input
      type="range"
      onChange={onChange}
      className={className}
      name={name}
      min="0"
      max="100"
      value={value}
      step="1"
    />
  );
};

const Volume = () => {
  const { volume, setVolume } = useContext(VolumeContext);

  const handleSound = (e) => {
    setVolume(e.target.value);
    localStorage.setItem('sound-level', e.target.value);
  };

  return (
    <div className="w-64 py-1.5 flex items-center justify-center hover:bg-ub-warm-grey hover:bg-opacity-20">
      <div className="w-8">
        <img
          width="16px"
          height="16px"
          src={process.env.PUBLIC_URL + "/assets/icons/SVG/headphones.svg"}
          alt="headphone"
        />
      </div>
      <Slider
        onChange={handleSound}
        className="slider w-2/3"
        value={volume}
        name="headphone_range"
      />
    </div>
  );
};

export default Volume;