import { IResource, ResourceType } from 'shared';

export class RawMilk extends Phaser.Physics.Matter.Sprite implements IResource {
  available = true;
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'raw-milk');
    this.setStatic(true);
    this.setSensor(true);
    this.setScale(0.5);
  }

  get collectable(): boolean {
    return true;
  }

  get resourceType(): ResourceType {
    return 'raw-milk';
  }

  get resourceTexture(): string {
    return 'raw-milk';
  }

  get value(): number {
    return 1;
  }
}
