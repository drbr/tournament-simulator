import { randomNumberInRange } from './utils';

export type CirclePosition = 'top' | 'bottom';

export type Circle = Readonly<{
  id: string;
  ranking: number;
  // Color is derived from number. But, precompute it for performance
  color: RGBColor;
  rectangleIndex: number;
  position: CirclePosition;
}>;

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export function randomCircle(id: string, rectIndex: number, position: CirclePosition): Circle {
  const value = randomNumberInRange(1, 99);
  return {
    id: `circle-${id}`,
    ranking: value,
    color: getCircleColor(value),
    rectangleIndex: rectIndex,
    position: position,
  };
}

/**
 * Calculates the gradient from blue (1) to orange (99) and returns as an RGB color
 */
function getCircleColor(circleValue: number): RGBColor {
  const normalizedValue = (circleValue - 1) / 98; // Normalize to 0-1 range

  const left: RGBColor = { r: 40, g: 100, b: 255 }; // blue
  const right: RGBColor = { r: 255, g: 80, b: 0 }; // orange-red

  const r = Math.round(left.r + (right.r - left.r) * normalizedValue);
  const g = Math.round(left.g + (right.g - left.g) * normalizedValue);
  const b = Math.round(left.b + (right.b - left.b) * normalizedValue);

  return { r, g, b };
}

export function toRgbString({ r, g, b }: RGBColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function sortInPlace(circles: Circle[]): readonly Circle[] {
  return circles.sort((a, b) => a.id.localeCompare(b.id));
}
