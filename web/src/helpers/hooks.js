import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 750);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
