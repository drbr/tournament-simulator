export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = 0; i < shuffled.length; i++) {
    const swapIndex = randomNumberInRange(i + 1, shuffled.length);
    const a = shuffled[i];
    const b = shuffled[swapIndex];
    if (a && b) {
      shuffled[swapIndex] = a;
      shuffled[i] = b;
    } else {
      throw new Error('The array indexing code is wrong!!');
    }
  }
  return shuffled;
}

export function randomNumberInRange(bottom: number, topInclusive: number): number {
  return Math.floor(Math.random() * topInclusive) + bottom;
}

export function generateArray<T>(length: number, constructor: (i: number) => T): T[] {
  return Array.from({ length }, (_, i) => constructor(i));
}
