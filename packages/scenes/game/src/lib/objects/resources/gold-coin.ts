import { GOLD_SCALE, IResource, ResourceType } from 'shared';

export class GoldCoin
  extends Phaser.Physics.Matter.Sprite
  implements IResource
{
  available = true;

  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'gold');
    this.setStatic(true);
    this.setSensor(true);
    this.setScale(GOLD_SCALE);
  }
  get collectable(): boolean {
    return false;
  }
  get resourceTexture(): string {
    return 'gold';
  }
  get resourceType(): ResourceType {
    return 'gold';
  }
  get value(): number {
    return 1;
  }
}
