
export function generateRandomNumber(format: string, code: string): string {
  let result = format;
  
  // Replace X with random digit
  for (let i = 0; i < (format.match(/X/g) || []).length; i++) {
    const digit = Math.floor(Math.random() * 10).toString();
    result = result.replace('X', digit);
  }

  // Handle specific logic for countries if needed (e.g. China 1st digit is always 1)
  // But based on the X format it should be fine.
  
  return result;
}
