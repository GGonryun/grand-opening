import { MiniMapBubble } from 'scenes/mini-map';
import { IShelf, Point } from 'shared';

export type ResourceWarningOptions = {
  shelf: IShelf;
  offset: Point;
};

export class ResourceWarning extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, { shelf, offset }: ResourceWarningOptions) {
    const x = shelf.x + offset.x;
    const y = shelf.y + offset.y;
    super(scene, x, y);

    const warning = new MiniMapBubble(this.scene, {
      worldX: 0,
      worldY: 0,
      texture: shelf.accepts[0],
    });
    warning.outline.setAngle(-40);

    this.add(warning);
  }
}
