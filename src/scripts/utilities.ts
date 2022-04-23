export function clamp(num: number, min: number = 0, max: number = 100) {
  // Clamp number between two values
  return Math.min(Math.max(num, min), max);
}
