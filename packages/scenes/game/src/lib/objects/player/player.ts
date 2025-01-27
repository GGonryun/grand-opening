import { COLLISION_LABEL, ElementDepths, GET_PHYSICS_SEED } from 'shared';

export class Player extends Phaser.Physics.Matter.Sprite {
  static CollisionKey = 'player';
  static Speed = 5 * GET_PHYSICS_SEED();
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'novice');
    // lock rotation
    this.setFixedRotation();
    this.setData(COLLISION_LABEL, Player.CollisionKey);
    this.setDepth(ElementDepths.Player);
    this.setScale(0.5);
  }

  setSpeed({ angle, force }: { angle: number; force: number }) {
    const speed = force * Player.Speed;
    this.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));
  }

  stopMovement() {
    this.setVelocity(0);
  }

  static owns(object: Phaser.GameObjects.GameObject): object is Player {
    return (
      object instanceof Player &&
      object.getData(COLLISION_LABEL) === this.CollisionKey
    );
  }
}
