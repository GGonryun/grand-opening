import { ResourceType } from '../resources/resources-system';
import { IShelf } from './stock-system';

export class TrashCan extends Phaser.Physics.Matter.Sprite implements IShelf {
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'trash');

    this.setStatic(true);
    this.setSensor(true);
  }

  get selfTexture(): string {
    return 'trash';
  }

  get defaultCapacity(): number {
    return 0;
  }

  get accepts(): ResourceType[] {
    return ['battery', 'strawberry', 'raw-milk'];
  }

  get maxCapacity(): number {
    return Infinity;
  }

  get cooldown(): number {
    return 0;
  }

  get consumption(): number {
    return 1;
  }

  get distanceThreshold(): number {
    return 8;
  }

  get label(): string {
    return 'Trash Can';
  }
}
