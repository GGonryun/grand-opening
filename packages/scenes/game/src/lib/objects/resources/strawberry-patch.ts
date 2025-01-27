import { IResource, ResourceType } from 'shared';

export class StrawberryPatch
  extends Phaser.Physics.Matter.Sprite
  implements IResource
{
  available = true;
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'strawberry');
    this.setStatic(true);
    this.setSensor(true);
    this.setScale(0.5);
  }

  get collectable(): boolean {
    return true;
  }

  get resourceType(): ResourceType {
    return 'strawberry';
  }

  get cooldown(): number {
    return 4500;
  }

  get resourceTexture(): string {
    return 'strawberry';
  }

  get value(): number {
    return 1;
  }
}
