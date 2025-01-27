export type MovementOptions = {
  object: Phaser.GameObjects.Components.Transform &
    Phaser.Physics.Matter.Components.Velocity;
  target: Pick<Phaser.Math.Vector2, 'x' | 'y'>;
  threshold: number;
  speed: number;
};

/**
 * @returns true if the object has reached the target position
 */
export const approachTarget = ({
  object,
  target,
  threshold,
  speed,
}: MovementOptions): boolean => {
  const distance = Phaser.Math.Distance.Between(
    object.x,
    object.y,
    target.x,
    target.y
  );

  if (distance < threshold) {
    object.setVelocity(0, 0);
    return true;
  } else {
    const directionX = target.x - object.x;
    const clampedDirectionX = Phaser.Math.Clamp(directionX, -100, 100);
    const directionY = target.y - object.y;
    const clampedDirectionY = Phaser.Math.Clamp(directionY, -100, 100);

    object.setVelocity(clampedDirectionX * speed, clampedDirectionY * speed);

    return false;
  }
};
