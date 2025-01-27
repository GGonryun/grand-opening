import { COLLISION_LABEL, IResource } from 'shared';
import { LoadingBar } from '../shared/loading-bar';
import { Inventory } from '../player/inventory';
import { minimapBus } from 'scenes/mini-map';

export class ResourcesSystem {
  static CollisionLabel = 'resource';

  scene: Phaser.Scene;
  inventory: Inventory;
  resources: Record<string, IResource>;
  bars: Record<string, LoadingBar>;

  constructor(scene: Phaser.Scene, inventory: Inventory) {
    this.scene = scene;
    this.inventory = inventory;
    this.resources = {};
    this.bars = {};
  }

  static owns(object: Phaser.GameObjects.GameObject): object is IResource {
    return object.getData(COLLISION_LABEL) === ResourcesSystem.CollisionLabel;
  }

  register(resource: IResource) {
    if (!resource.name) {
      resource.name = Phaser.Math.RND.uuid();
    }

    resource.setData(COLLISION_LABEL, ResourcesSystem.CollisionLabel);

    this.resources[resource.name] = resource;

    if (resource.cooldown) {
      this.createBar(resource);
    }
  }

  private createBar(resource: IResource) {
    const bar = new LoadingBar(this.scene, {
      parent: resource,
      color: 0x00ff00,
      size: { width: 64, height: 10 },
      offset: new Phaser.Math.Vector2(0, -40),
    });

    this.scene.add.existing(bar);

    this.bars[resource.name] = bar;

    this.startCooldown(resource);
  }

  reclaim(resource: IResource) {
    delete this.resources[resource.name];
    resource.destroy();

    const bar = this.bars[resource.name];
    if (bar) {
      bar.destroy();
      delete this.bars[resource.name];
    }
  }

  claim(resource: IResource) {
    if (resource.collectable && this.inventory.isFull) return;
    if (!resource.available) return;

    minimapBus.emit('resource-claimed', resource);
    // one time use resources (e.g. coins or generated products)
    if (!resource.cooldown) {
      resource.setVisible(false);
      resource.available = false;
      this.inventory.insert(resource);
      this.reclaim(resource);
      return;
    }

    resource.setVisible(false);
    resource.available = false;

    this.inventory.insert(resource);
    this.startCooldown(resource);
  }

  startCooldown(resource: IResource) {
    const bar = this.bars[resource.name];
    bar.setFill(0);
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: resource.cooldown,
      onStart: () => {
        bar.setVisible(true);
        bar.setFill(0);
        resource.setVisible(false);
        resource.available = false;
      },
      onUpdate: (tween) => {
        bar.setFill(tween.getValue());
      },
      onComplete: () => {
        bar.setVisible(false);
        resource.setVisible(true);
        resource.available = true;
        minimapBus.emit('resource-online', {
          worldX: resource.x,
          worldY: resource.y,
          texture: resource.resourceTexture,
          name: resource.name,
          type: 'resource',
        });
      },
    });
  }
}
