import { Circle, CirclePosition, toRgbString } from './Circle';
import { generateArray } from './utils';

const CIRCLE_Y: Record<CirclePosition, number> = {
  top: 40,
  bottom: 120,
};

function animationStyles(animationTimeMilliseconds: number) {
  const delaySecondsString = `${animationTimeMilliseconds / 1000}s`;
  return `
  .animated-circle , .animated-text {
    transition: transform ${delaySecondsString} ease-in-out;
  }
`;
}

function getCircleX(rectangleIndex: number): number {
  return 45 + rectangleIndex * 100;
}

function getPositionTransform(rectangleIndex: number, circlePosition: CirclePosition): string {
  const x = getCircleX(rectangleIndex);
  const y = CIRCLE_Y[circlePosition];
  return `translate(${x}, ${y})`;
}

export const ParticipantsView: React.FC<{
  circles: readonly Circle[];
  rectangleCount: number;
  animationTimeMilliseconds: number;
}> = ({ circles, rectangleCount, animationTimeMilliseconds }) => {
  return (
    <>
      <style>{animationStyles(animationTimeMilliseconds)}</style>
      <svg width="100%" height="160" viewBox={`0 0 ${rectangleCount * 100 - 10} 160`}>
        {generateArray(rectangleCount, (rectIndex: number) => (
          <g key={String(rectIndex)}>
            <rect
              x={rectIndex * 100}
              y={0}
              width={90}
              height={160}
              fill="none"
              stroke="#333"
              strokeWidth="2"
              rx="5"
            />
          </g>
        ))}
        {/* Each participant is a <g> containing a circle and its text.
        The elements are positioned via their `transform` property. It's important that
        the keys refer to the participants' actual IDs, so they can animate properly. */}
        {circles.map((circle: Circle) => (
          <ParticipantCircle key={circle.id} circle={circle} />
        ))}
      </svg>
    </>
  );
};

const ParticipantCircle: React.FC<{ circle: Circle }> = ({ circle }) => {
  return (
    <g key={circle.id}>
      {/* Circle */}
      <circle
        cx={0}
        cy={0}
        transform={getPositionTransform(circle.rectangleIndex, circle.position)}
        className="animated-circle"
        r={25}
        fill={toRgbString(circle.color)}
        stroke="#333"
        strokeWidth="1"
      />

      {/* Number text */}
      <text
        x={0}
        y={0}
        transform={getPositionTransform(circle.rectangleIndex, circle.position)}
        className="animated-text"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
        style={{
          textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
        {circle.ranking}
      </text>
    </g>
  );
};
