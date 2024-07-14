import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface InfoIconProps {
  tooltip: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ tooltip }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative inline-block ml-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FontAwesomeIcon
        icon={faInfoCircle}
        className="text-zinc-400 hover:text-white cursor-help text-xs"
      />
      {isHovered && (
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 w-48 p-2 bg-black text-white text-xs rounded-md shadow-lg z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default InfoIcon;