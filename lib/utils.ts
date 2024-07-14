import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number) {
  const abbreviations = ['', 'K', 'Millions', 'Billions', 'Trillions'];
  const order = Math.max(0, Math.floor(Math.log10(Math.abs(num)) / 3));
  const shortValue = order >= abbreviations.length ? num : (num / Math.pow(1000, order)).toFixed(2);
  return `${shortValue}${abbreviations[order]}`;
}