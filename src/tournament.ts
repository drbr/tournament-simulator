import { Circle, sortInPlace } from './Circle';
import { randomNumberInRange } from './utils';
import groupBy from 'lodash/groupBy';

export type MatchParticipant = {
  id: string;
  ranking: number; // from 1 to 99
};

function matchWinner(a: Circle, b: Circle, fairness: number): Circle {
  const aChance = a.ranking + fairness;
  const bChance = b.ranking + fairness;

  const randomNumber = randomNumberInRange(0, aChance + bChance);
  if (randomNumber < aChance) {
    return a;
  } else {
    return b;
  }
}

/**
 * Runs one match and returns the participant circles in their new locations after the match.
 * @param circles
 * @param numRectangles
 * @returns A list of circles. It's important that these are returned in the same order
 * as they started. The easy way to do this is just to sort them by ID.
 */
export function playMatch(
  circles: readonly Circle[],
  numRectangles: number,
  fairness: number
): readonly Circle[] {
  const next: Circle[] = [];
  // Group the participants into matches, denoted by their rectangle index. Then, play each match
  // and determine the winner. The winner goes to the next rectangle, always on the top; and the
  // loser goes to the previous rectangle, always on the bottom. After this operation, the winner of
  // the rightmost match and the loser of the leftmost match will have shifted out of bounds, so  we
  // have to use different logic to pull them back to their empty spaces.
  const matches = groupBy(circles, 'rectangleIndex');
  for (const match of Object.values(matches)) {
    const [a, b] = match;
    if (!a || !b) {
      throw new Error('The indexing logic is wrong!!!!');
    }
    const winner = matchWinner(a, b, fairness);
    const loser = winner === a ? b : a;
    next.push(newPositionForWinner(winner, numRectangles));
    next.push(newPositionForLoser(loser));
  }
  return sortInPlace(next);
}

function newPositionForWinner(winner: Circle, numRectangles: number): Circle {
  const [nextRect, nextPosition] = [winner.rectangleIndex + 1, 'top'] as const;
  if (nextRect < numRectangles) {
    return { ...winner, rectangleIndex: nextRect, position: nextPosition };
  } else {
    return { ...winner, rectangleIndex: numRectangles - 1, position: 'bottom' };
  }
}
function newPositionForLoser(loser: Circle): Circle {
  const [nextRect, nextPosition] = [loser.rectangleIndex - 1, 'bottom'] as const;
  if (nextRect >= 0) {
    return { ...loser, rectangleIndex: nextRect, position: nextPosition };
  } else {
    return { ...loser, rectangleIndex: 0, position: 'top' };
  }
}
