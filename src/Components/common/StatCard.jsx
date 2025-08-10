import { useState, useEffect } from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "primary", 
  trend = null,
  delay = 0,
  className = ""
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const colorClasses = {
    primary: {
      bg: "bg-primary-100 dark:bg-primary-900/30",
      text: "text-primary-600 dark:text-primary-400",
      icon: "text-primary-600 dark:text-primary-400"
    },
    success: {
      bg: "bg-success-100 dark:bg-success-900/30",
      text: "text-success-600 dark:text-success-400",
      icon: "text-success-600 dark:text-success-400"
    },
    warning: {
      bg: "bg-warning-100 dark:bg-warning-900/30",
      text: "text-warning-600 dark:text-warning-400",
      icon: "text-warning-600 dark:text-warning-400"
    },
    danger: {
      bg: "bg-danger-100 dark:bg-danger-900/30",
      text: "text-danger-600 dark:text-danger-400",
      icon: "text-danger-600 dark:text-danger-400"
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate number counting
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div 
      className={`
        card hover:shadow-medium transition-all duration-300 cursor-pointer
        ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'}
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${colorClasses[color].text}`}>
                {typeof animatedValue === 'number' ? animatedValue.toLocaleString() : animatedValue}
              </p>
              {trend && (
                <span className={`text-sm font-medium ${
                  trend > 0 ? 'text-success-600 dark:text-success-400' : trend < 0 ? 'text-danger-600 dark:text-danger-400' : 'text-secondary-500 dark:text-secondary-400'
                }`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
          </div>
          
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${colorClasses[color].bg} transform transition-transform duration-200 hover:scale-110
          `}>
            <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
          </div>
        </div>
        
        {trend !== null && (
          <div className="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
            <div className="flex items-center gap-1">
              <svg
                className={`w-4 h-4 ${trend >= 0 ? 'text-success-500 dark:text-success-400 rotate-0' : 'text-danger-500 dark:text-danger-400 rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              <span className="text-xs text-secondary-600 dark:text-secondary-400">
                {trend >= 0 ? 'Increase' : 'Decrease'} from last month
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
