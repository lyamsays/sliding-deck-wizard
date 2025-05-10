
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      <span className="font-semibold text-xl text-gray-800">Sliding.io</span>
    </div>
  );
};

export default Logo;
