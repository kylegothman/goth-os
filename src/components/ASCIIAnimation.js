import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ASCIIAnimation = ({ frameCount, frameRate }) => {
  const [frames, setFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const fetchFrames = async () => {
      const fetchedFrames = [];

      for (let i = 0; i < frameCount; i++) {
        const filePath = process.env.PUBLIC_URL + `/assets/spheres_output/sphere_ascii${i.toString().padStart(3, '0')}.txt`;
        const response = await axios.get(filePath);
        fetchedFrames.push(response.data);
      }

      setFrames(fetchedFrames);
    };

    fetchFrames();
  }, [frameCount]);

  useEffect(() => {
    if (frames.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount);
    }, 1000 / frameRate);

    return () => clearInterval(intervalId);
  }, [frames, frameCount, frameRate]);

  return (
    <div
      id="ascii-animation"
      className="flex items-center justify-center w-full h-full absolute top-0 left-0 overflow-hidden text-white bg-center bg-cover"
    >
      <pre style={{ fontFamily: 'monospace' }}>
        {frames[currentFrame]}
      </pre>
    </div>
  );
};

export default ASCIIAnimation;




