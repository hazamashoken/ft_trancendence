import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createAbbreviation(sentence: string) {
  // Split the sentence into words
  const words = sentence.trim().split(" ");
  if (!words[0]) return "";

  // Initialize an empty string to store the abbreviation
  let abbreviation = "";

  // Loop through each word and append the first letter (up to 4 characters) to the abbreviation
  for (let i = 0; i < words.length; i++) {
    const firstLetter = words[i][0]; // Get the first letter of the word
    abbreviation += firstLetter; // Append the first letter
  }

  return abbreviation.slice(0, 4);
}
