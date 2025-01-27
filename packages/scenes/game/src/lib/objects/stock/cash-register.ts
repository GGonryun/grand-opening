import { IShelf, ResourceType } from 'shared';

export class CashRegister
  extends Phaser.Physics.Matter.Sprite
  implements IShelf
{
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'register');

    this.setStatic(true);
    this.setSensor(true);
    this.setScale(0.75);
  }

  get selfTexture(): string {
    return 'register';
  }

  get defaultCapacity(): number {
    return 0;
  }

  get produces(): ResourceType {
    return 'register';
  }

  get accepts(): ResourceType[] {
    return ['battery'];
  }

  get maxCapacity(): number {
    return 10;
  }

  get cooldown(): number {
    return 5000;
  }

  get consumption(): number {
    return 1;
  }

  get distanceThreshold(): number {
    return 64;
  }
  get label(): string {
    return 'Cash Register';
  }
}
