import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const version = process.env.API_VERSION;

  return baseUrl && version ? `${baseUrl}/${version}` : '/'
};
