import { Movement } from './player-input';

export class TargetingRing extends Phaser.GameObjects.Container {
  targetingRing: Phaser.GameObjects.Arc;
  targetingDot: Phaser.GameObjects.Arc;
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    const alpha = 0.5;
    this.targetingRing = new Phaser.GameObjects.Arc(
      scene,
      0,
      0,
      92,
      0,
      360,
      false,
      0x00ff00,
      alpha
    );
    this.targetingDot = new Phaser.GameObjects.Arc(
      scene,
      0,
      0,
      32,
      0,
      360,
      false,
      0x0000ff,
      alpha
    );
    this.add([this.targetingRing, this.targetingDot]);
  }

  hide() {
    this.targetingRing.setVisible(false);
    this.targetingDot.setVisible(false);
  }

  show() {
    this.targetingRing.setVisible(true);
    this.targetingDot.setVisible(true);
  }
  /**
   * Takes a pointer and sets the inner dot to the pointer's location.
   * Clamps the pointer's location to the targeting ring's radius.
   * @param pointer
   * @returns the angle in radians
   */
  setLocation(pointer: Phaser.Input.Pointer): Movement {
    // Get the distance from the center of the targeting ring to the pointer
    const dx = pointer.x - this.x;
    const dy = pointer.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Clamp the distance to the targeting ring's radius
    const clampedDistance = Math.min(distance, this.targetingRing.radius);
    // Set the inner dot's position to the clamped distance
    this.targetingDot.setPosition(
      (dx / distance) * clampedDistance,
      (dy / distance) * clampedDistance
    );

    const angle = Math.atan2(dy, dx);

    return { force: clampedDistance / this.targetingRing.radius, angle };
  }
}
