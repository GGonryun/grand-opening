import { IShelf, ResourceType } from 'shared';

export class Fridge extends Phaser.Physics.Matter.Sprite implements IShelf {
  available = true;
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'fridge');

    this.setStatic(true);
    this.setSensor(true);
  }

  get selfTexture(): string {
    return 'fridge';
  }

  get produces(): ResourceType {
    return 'cold-milk';
  }

  get accepts(): ResourceType[] {
    return ['raw-milk'];
  }

  get maxCapacity(): number {
    return 10;
  }

  get defaultCapacity(): number {
    return 0;
  }

  get cooldown(): number {
    return 500;
  }

  get consumption(): number {
    return 1;
  }

  get distanceThreshold(): number {
    return 64;
  }

  get label(): string {
    return 'Milk Fridge';
  }
}
