import { createContext } from 'react';

const VolumeContext = createContext({
  volume: 75,
  setVolume: () => {},
});

export default VolumeContext;