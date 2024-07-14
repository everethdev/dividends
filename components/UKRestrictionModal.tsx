// components/UKRestrictionModal.tsx
import React from 'react';

interface UKRestrictionModalProps {
  isOpen: boolean;
}

const UKRestrictionModal: React.FC<UKRestrictionModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Welcome to UniFlash</h2>
        <p className="mb-4">
          This feature is not available for use by residents of the United
          Kingdom.
        </p>
        <p className="mb-4">
          If you are located in the UK, please be advised that you are
          prohibited from accessing and utilizing this dApp.
        </p>
        <p>
          Find more resources from the FCA{' '}
          <a
            href="https://www.fca.org.uk/publication/correspondence/final-warning-cryptoasset-firms-marketing-consumers.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default UKRestrictionModal;