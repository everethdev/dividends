import type { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chain } = req.query;

  if (typeof address !== 'string' || typeof chain !== 'string') {
    res.status(400).json({ error: 'Invalid address or chain' });
    return;
  }

  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });

    const response = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain,
    });

    res.status(200).json(response.raw);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}