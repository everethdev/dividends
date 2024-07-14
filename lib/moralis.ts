// moralis.ts
import Moralis from 'moralis';

const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || '';

export const initMoralis = async () => {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZhMTQyNGEyLTM2MjYtNDI1Mi1hNTVmLTk1N2RlZDgxZDNkZSIsIm9yZ0lkIjoiMzkyODQ0IiwidXNlcklkIjoiNDAzNjU4IiwidHlwZUlkIjoiMmFhMTM4YzgtNjIzYS00ZmY1LTgyODEtYTJmNzExOWQ5ZTk3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYxMTY5MzcsImV4cCI6NDg3MTg3NjkzN30.qNOcRa_cbIVcOwz95FrSNjqRMi_O-ygKolmQ-JDbrZo",
  });
};

export const moralisInstance = Moralis;