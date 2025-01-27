import { IResource, ResourceType } from 'shared';

export class BatteryStation
  extends Phaser.Physics.Matter.Sprite
  implements IResource
{
  static CollisionKey = 'battery-station';

  available = true;
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
    super(world, x, y, 'battery');
    this.setStatic(true);
    this.setSensor(true);
    this.setScale(0.4);
  }

  get collectable(): boolean {
    return true;
  }

  get cooldown(): number {
    return 7500;
  }

  get resourceType(): ResourceType {
    return 'battery';
  }

  get resourceTexture(): string {
    return 'battery';
  }

  get value(): number {
    return 5;
  }
}
