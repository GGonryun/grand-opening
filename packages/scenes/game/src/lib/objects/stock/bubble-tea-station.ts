import { IShelf, ResourceType } from 'shared';

export class BubbleTeaStation
  extends Phaser.Physics.Matter.Sprite
  implements IShelf
{
  available = true;
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'tea-machine');
    this.setStatic(true);
    this.setSensor(true);
  }
  get selfTexture(): string {
    return 'tea-machine';
  }
  get produces(): ResourceType {
    return 'bubble-tea';
  }
  get accepts(): ResourceType[] {
    return ['raw-milk'];
  }
  get maxCapacity(): number {
    return 6;
  }
  get defaultCapacity(): number {
    return 0;
  }
  get cooldown(): number {
    return 10000;
  }
  get consumption(): number {
    return 1;
  }
  get distanceThreshold(): number {
    return 64;
  }
  get label(): string {
    return 'Bubble Tea Station';
  }
}
