import { useState } from 'react';
import Desktop from './components/screens/Desktop';
import Navbar from './components/screens/Navbar';
import VolumeContext from './components/utils/VolumeContext';

const DEFAULT_VOLUME = 75;

function readStoredVolume(): number {
  const stored = localStorage.getItem('sound-level');
  const parsed = stored === null ? NaN : Number(stored);
  return Number.isFinite(parsed) ? parsed : DEFAULT_VOLUME;
}

export default function App() {
  const [volume, setVolume] = useState<number>(readStoredVolume);

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      <div className="page-wrapper">
        <Navbar />
        <Desktop />
      </div>
    </VolumeContext.Provider>
  );
}
