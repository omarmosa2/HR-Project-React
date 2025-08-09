const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-spin"></div>
        
        {/* Inner spinning part */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        
        {/* Center dot */}
        <div className="absolute inset-2 rounded-full bg-primary-100 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
