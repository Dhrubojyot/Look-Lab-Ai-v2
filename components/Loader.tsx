import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Mixing & matching styles...",
  "Consulting our AI stylist...",
  "Tailoring the perfect fit...",
  "Applying the finishing touches...",
  "Your new look is almost ready!",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm animate-fade-in">
      {/* Animated placeholder */}
      <div className="w-full h-72 bg-gray-200 rounded-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
      
      <div>
        <p className="text-lg font-semibold text-primary transition-opacity duration-500 h-6">
          {loadingMessages[messageIndex]}
        </p>
        <p className="text-sm text-gray-500 mt-1">This can take a moment, please be patient.</p>
      </div>
    </div>
  );
};