export function isValidObjectId(idString: string) {
  // Check if the string is a 24-character hexadecimal string
  return /^[0-9a-fA-F]{24}$/.test(idString);
};