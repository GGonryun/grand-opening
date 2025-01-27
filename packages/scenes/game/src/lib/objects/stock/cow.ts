import { IShelf, ResourceType, IResource } from 'shared';
import { RawMilk } from '../resources/raw-milk';

export class Cow extends Phaser.Physics.Matter.Sprite implements IShelf {
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'cow');
    this.setStatic(true);
    this.setSensor(true);
  }
  get selfTexture(): string {
    return 'cow';
  }
  get maxCapacity(): number {
    return 6;
  }
  get defaultCapacity(): number {
    return 0;
  }
  get cooldown(): number {
    return 9000;
  }
  get consumption(): number {
    return 1;
  }
  get distanceThreshold(): number {
    return 64;
  }
  get accepts(): ResourceType[] {
    return ['strawberry'];
  }
  generates(world: Phaser.Physics.Matter.World): IResource {
    return new RawMilk(world, 0, 0);
  }
  get label(): string {
    return 'Cow';
  }
}
