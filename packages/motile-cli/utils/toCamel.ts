export function toCamelCase(input: string): string {
  return input
    .split("_") // Split the string by underscore
    .map((word, index) => {
      // Capitalize the first letter of each word except the first word
      if (index === 0) {
        return word.toLowerCase(); // Ensure the first word is in lower case
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(""); // Join the words to form a camelCase string
}
