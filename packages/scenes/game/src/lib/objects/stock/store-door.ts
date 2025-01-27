import { IShelf, ResourceType } from 'shared';

export class StoreDoor extends Phaser.Physics.Matter.Sprite implements IShelf {
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'door');

    this.setStatic(true);
    this.setSensor(true);
  }

  get defaultCapacity(): number {
    return 1;
  }

  get selfTexture(): string {
    return 'door';
  }

  get produces(): ResourceType {
    return 'door';
  }

  get accepts(): ResourceType[] {
    return [];
  }

  get maxCapacity(): number {
    return 1;
  }

  get cooldown(): number {
    return 0;
  }

  get consumption(): number {
    return 0;
  }

  get distanceThreshold(): number {
    return 5;
  }
  get label(): string {
    return 'Store Door';
  }
}
