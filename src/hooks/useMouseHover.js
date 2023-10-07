import { useState, useEffect, useRef } from 'react';

// Custom hook for handling mouse hover
function useMouseHover() {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    // Attach event listeners when the component mounts
    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('mouseenter', handleMouseEnter);
      cardElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // Clean up the event listeners when the component unmounts
    return () => {
      if (cardElement) {
        cardElement.removeEventListener('mouseenter', handleMouseEnter);
        cardElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return { isHovered, cardRef };
}

export default useMouseHover;
