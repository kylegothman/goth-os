import React, {useState} from 'react';
import Desktop from './components/screens/Desktop';
import Navbar from './components/screens/Navbar';
import VolumeContext from './components/utils/VolumeContext';

function App() {
  const [volume, setVolume] = useState(localStorage.getItem('sound-level') || 75);

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      <div className="page-wrapper">
        <Navbar />
        <Desktop />
      </div>
    </VolumeContext.Provider>
  );
}

export default App;