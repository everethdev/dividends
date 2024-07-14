// components/ui/DisclaimerNotification.tsx

import React, { useState } from 'react';

const DisclaimerNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="container mx-auto py-12">
        <h2 className="bg-gradient-to-r from-neutral-100 to-neutral-900 bg-clip-text text-transparent text-3xl font-bold mb-4">Disclaimer</h2>
        <p className="text-lg text-neutral-500">
          Nothing on <strong>EverETH.net</strong> website is an offer to sell, or the solicitation of an offer to buy, any tokens, including EETH or EverETH Reflect. EverETH is publishing this website solely to provide information about its products, services, and ecosystem. Nothing in this website should be treated or read as a guarantee or promise of how EverETH business, services, or the tokens will develop or of the utility or value of the tokens.
        </p>
        <p className="text-lg text-neutral-500 mt-4">
          The <strong>EverETH.net</strong> website outlines current plans, which could change at EverETH discretion, and the success of which will depend on many factors outside EverETH control, including market-based factors and factors within the data and cryptocurrency industries, among others. Any statements about future events are based solely on EverETH analysis of the issues described on <strong>EverETH.net</strong> website. That analysis may prove to be incorrect.
        </p>
        <p className="text-lg text-neutral-500 mt-4">
          This disclaimer aims to clarify that the information provided on the EverETH website is not an offer or solicitation for the sale of tokens, but rather a platform to share details about the projects current plans and ecosystem. It also emphasizes that future plans and statements are subject to change and may not accurately reflect the projects eventual development or the performance of its tokens.
        </p>
      </section>
  );
};

export default DisclaimerNotification;
