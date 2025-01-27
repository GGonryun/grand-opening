import { IShelf, ResourceType } from 'shared';

export class StrawberryShelf
  extends Phaser.Physics.Matter.Sprite
  implements IShelf
{
  available = true;

  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'shelf');

    this.setStatic(true);
    this.setSensor(true);
  }

  get defaultCapacity(): number {
    return 0;
  }

  get selfTexture(): string {
    return 'shelf';
  }

  get produces(): ResourceType {
    return 'strawberry';
  }

  get accepts(): ResourceType[] {
    return ['strawberry'];
  }

  get maxCapacity(): number {
    return 12;
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
    return 'Strawberry Shelf';
  }
}
