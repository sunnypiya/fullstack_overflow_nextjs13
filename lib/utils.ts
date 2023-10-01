import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date): string => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - createdAt.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else if (weeks > 0) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }
};

export const formatNumber = (inputNumber: number): string => {
  if (inputNumber >= 1_000_000_000_000) {
    const formattedNumber = (inputNumber / 1_000_000_000_000).toFixed(1);
    return `${formattedNumber}T`;
  } else if (inputNumber >= 1_000_000_000) {
    const formattedNumber = (inputNumber / 1_000_000_000).toFixed(1);
    return `${formattedNumber}B`;
  } else if (inputNumber >= 1_000_000) {
    const formattedNumber = (inputNumber / 1_000_000).toFixed(1);
    return `${formattedNumber}M`;
  } else if (inputNumber >= 1_000) {
    const formattedNumber = (inputNumber / 1_000).toFixed(1);
    return `${formattedNumber}K`;
  } else {
    return inputNumber.toString();
  }
};

