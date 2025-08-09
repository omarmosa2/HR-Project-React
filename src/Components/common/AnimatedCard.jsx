import { useState } from 'react';

const AnimatedCard = ({ 
  children, 
  className = "", 
  hover = true, 
  delay = 0,
  direction = "up" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const directionClasses = {
    up: "translate-y-2",
    down: "-translate-y-2", 
    left: "translate-x-2",
    right: "-translate-x-2"
  };

  const animationDelay = delay ? `animation-delay: ${delay}ms;` : '';

  return (
    <div
      className={`
        card transform transition-all duration-300 ease-out animate-slide-up
        ${hover ? 'hover:scale-105 hover:shadow-large cursor-pointer' : ''}
        ${isHovered ? 'shadow-glow' : ''}
        ${className}
      `}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-transform duration-200 ${isHovered && hover ? directionClasses[direction] : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;
