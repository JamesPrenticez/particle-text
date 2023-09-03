import React, { useState, useEffect } from 'react';

const useScreenSize = (ref) => {
  const [screenSize, setScreenSize] = useState('xl'); // Default to extra large

  const updateScreenSize = () => {
    const width = ref.current ? ref.current.offsetWidth : window.innerWidth;

    if (width < 640) {
      setScreenSize('sm'); // Small screen
    } else if (width >= 640 && width < 768) {
      setScreenSize('md'); // Medium screen
    } else if (width >= 768 && width < 1024) {
      setScreenSize('lg'); // Large screen
    } else {
      setScreenSize('xl'); // Extra large screen
    }
  };

  useEffect(() => {
    // Initialize screen size
    updateScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', updateScreenSize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);  // <-- Empty dependency array

  return screenSize;
};

export default useScreenSize;
