import { format } from 'date-fns';

/**
 * Calculate life path number from birthdate
 */
export const calculateLifePathNumber = (birthdate: string): number => {
  const dateStr = birthdate.replace(/-/g, ''); // Remove hyphens
  let sum = 0;
  
  // Sum all digits
  for (let i = 0; i < dateStr.length; i++) {
    sum += parseInt(dateStr[i]);
  }
  
  // Reduce to a single digit (unless it's 11, 22, or 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let tempSum = 0;
    sum.toString().split('').forEach(digit => {
      tempSum += parseInt(digit);
    });
    sum = tempSum;
  }
  
  return sum;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy');
};

/**
 * Get Western zodiac sign from birthdate
 */
export const getWesternZodiac = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

/**
 * Get Chinese zodiac sign from birthdate
 */
export const getChineseZodiac = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  return animals[(year - 4) % 12];
};

/**
 * Generate a unique ID
 */
export const generateUniqueId = (): string => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};
