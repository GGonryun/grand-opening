import { ElementDepths, IResource, ResourceType } from 'shared';
import { Player } from './player';

class HeldResource extends Phaser.GameObjects.Sprite {
  resource: IResource;
  constructor(scene: Phaser.Scene, x: number, y: number, resource: IResource) {
    super(scene, x, y, resource.resourceTexture);
    this.resource = resource;
  }
}

export class Inventory extends Phaser.GameObjects.Container {
  static Offset = 20;
  player: Player;
  fullInventoryText: Phaser.GameObjects.Text;
  carryingCapacity = 5;
  constructor(scene: Phaser.Scene, player: Player) {
    super(scene, 0, 0);
    this.setDepth(ElementDepths.Player);

    this.player = player;

    this.fullInventoryText = new Phaser.GameObjects.Text(
      this.scene,
      0,
      0,
      'MAX',
      {
        fontSize: '32px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 6,
      }
    ).setOrigin(0.5, 0.5);
    this.add(this.fullInventoryText);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  insert(resource: IResource) {
    if (resource.collectable) {
      const offset = this.list.length * -Inventory.Offset;
      const sprite = new HeldResource(this.scene, 0, offset, resource).setScale(
        0.3
      );
      this.add(sprite);
    }
  }

  override update() {
    this.x = this.player.x + 32;
    this.y = this.player.y;

    this.fullInventoryText.setPosition(
      0,
      -16 + this.list.length * -Inventory.Offset
    );

    if (this.isFull) {
      this.fullInventoryText.setVisible(true);
    } else {
      this.fullInventoryText.setVisible(false);
    }
  }

  get isFull() {
    return (
      this.list.filter((i) => i instanceof Phaser.GameObjects.Sprite).length >=
      this.carryingCapacity
    );
  }

  drop(types: ResourceType[]): IResource | undefined {
    for (const type of types) {
      const held = this.list.find(
        (i) => i instanceof HeldResource && i.resource.resourceType === type
      ) as HeldResource | undefined;
      if (held) {
        this.remove(held, true);
        held.destroy();
        this.reorganize();
        return held.resource;
      }
    }

    return undefined;
  }

  reorganize() {
    this.list.forEach((i, index) => {
      if (i instanceof Phaser.GameObjects.Sprite) {
        i.setPosition(0, index * -Inventory.Offset);
      }
    });
  }
}
