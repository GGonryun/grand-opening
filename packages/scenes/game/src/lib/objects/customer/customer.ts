import { COLLISION_LABEL, GET_PHYSICS_SEED } from 'shared';

export class Customer extends Phaser.Physics.Matter.Sprite {
  static CollisionKey = 'customer';
  seed: number;
  constructor(scene: Phaser.Scene) {
    const id = Phaser.Math.RND.pick([1, 2, 3]);
    const slime = `slime-${id}`;
    super(scene.matter.world, 0, 0, slime);

    this.seed = GET_PHYSICS_SEED();

    this.name = Phaser.Math.RND.uuid();

    this.setSensor(true);
    this.setData(COLLISION_LABEL, Customer.CollisionKey);
    this.setScale(0.6);
  }

  hide() {
    this.setActive(false);
    this.setVisible(false);
  }

  get speed() {
    return 0.02 * this.seed;
  }

  static owns(object: Phaser.GameObjects.GameObject): object is Customer {
    return (
      object instanceof Customer &&
      object.getData(COLLISION_LABEL) === this.CollisionKey
    );
  }
}
