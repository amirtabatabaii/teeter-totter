export function getBarY(element, angleDegree, barLengthStep) {
  const angle = celciusToRadian(angleDegree);
  return (4 - element.xStep + 0.5) * barLengthStep * Math.sin(angle);
}

export function calculateRatioAngle(leftMomentum, rightMomentum) {
  const differenceRatio =
    (Math.abs(leftMomentum - rightMomentum) /
      Math.max(leftMomentum, rightMomentum)) *
    100;

  let angleDegree;

  if (leftMomentum > rightMomentum) {
    angleDegree = differenceRatio / 3;
  } else {
    angleDegree = (-1 * differenceRatio) / 3;
  }

  if (angleDegree > 10) angleDegree = 10;
  if (angleDegree < -10) angleDegree = -10;

  return [differenceRatio, angleDegree];
}

export function celciusToRadian(angleDegree) {
  return (angleDegree / 180) * Math.PI;
}
