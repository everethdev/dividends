// AlertNotification.tsx
import React, { useEffect, useState } from 'react';

interface AlertNotificationProps {
  message: string;
  onClose: () => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ message, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (message) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const fadeClasses = `transition-all duration-500 ${showAlert ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={`fixed rounded-full top-10 left-50 right-50 z-50 ${fadeClasses}`}>
      <div className="text-center py-4 lg:px-4 bg-black bg-opacity-75">
        <div className="p-2 bg-green-400 items-center text-black leading-none lg:rounded-full flex lg:inline-flex" role="alert">
          <span className="flex rounded-full uppercase px-1 py-1 text-xs font-bold mr-3">✅</span>
          <span className="font-semibold mr-2 text-left flex-auto">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification;