import { COLLISION_LABEL, IShelf, ResourceType } from 'shared';
import { Inventory } from '../player/inventory';
import { ResourcesSystem } from '../resources/resources-system';
import { LoadingBar } from '../shared/loading-bar';
import { notificationBus } from 'scenes/notifications';
import { ResourceGenerator } from './resource-generator';
import { minimapBus } from 'scenes/mini-map';
import { ResourceWarning } from './resource-warning';

export class StockSystem {
  static CollisionLabel = 'shelf';

  scene: Phaser.Scene;
  inventory: Inventory;
  resources: ResourcesSystem;
  shelf: Record<string, IShelf>;
  bars: Record<string, LoadingBar>;
  occupancy: Record<string, number>;
  warnings: Record<string, ResourceWarning>;
  locks: Record<string, LoadingBar>;
  generators: Record<string, ResourceGenerator>;
  texts: Record<string, Phaser.GameObjects.Text>;

  constructor(
    scene: Phaser.Scene,
    inventory: Inventory,
    resources: ResourcesSystem
  ) {
    this.scene = scene;
    this.inventory = inventory;
    this.resources = resources;
    this.shelf = {};
    this.bars = {};
    this.texts = {};
    this.occupancy = {};
    this.generators = {};
    this.locks = {};
    this.warnings = {};
  }

  static owns(object: Phaser.GameObjects.GameObject): object is IShelf {
    return object.getData(COLLISION_LABEL) === StockSystem.CollisionLabel;
  }

  register(shelf: IShelf) {
    if (!shelf.name) {
      shelf.name = Phaser.Math.RND.uuid();
    }

    shelf.setData(COLLISION_LABEL, StockSystem.CollisionLabel);

    this.shelf[shelf.name] = shelf;
    this.occupancy[shelf.name] = shelf.defaultCapacity;

    this.createBar(shelf);
    this.createWarning(shelf);
    this.createFillText(shelf);
    this.updateProgress(shelf, 0);

    if (shelf.generates) {
      this.generators[shelf.name] = new ResourceGenerator(this, shelf);
    }
  }

  private createWarning(shelf: IShelf) {
    const warning = new ResourceWarning(this.scene, {
      shelf,
      offset: new Phaser.Math.Vector2(-64, -64),
    });
    warning.setVisible(
      Boolean(shelf.accepts.length && (shelf.generates || shelf.produces))
    );
    this.warnings[shelf.name] = warning;
    this.scene.add.existing(warning);
  }

  private createBar(shelf: IShelf) {
    const bar = new LoadingBar(this.scene, {
      parent: shelf,
      size: { width: 100, height: 10 },
      color: 0xff0000,
      offset: new Phaser.Math.Vector2(0, -70),
    });
    this.scene.add.existing(bar);
    bar.setFill(0);
    bar.setVisible(
      Boolean(shelf.accepts.length && (shelf.generates || shelf.produces))
    );

    this.bars[shelf.name] = bar;
  }

  private createFillText(shelf: IShelf) {
    const text = new Phaser.GameObjects.Text(
      this.scene,
      shelf.x,
      shelf.y - 112,
      'FULL',
      {
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      }
    ).setOrigin(0.5, 0.5);
    text.setVisible(false);
    this.scene.add.existing(text);

    this.texts[shelf.name] = text;
  }

  private createLock(shelf: IShelf) {
    const bar = new LoadingBar(this.scene, {
      parent: shelf,
      size: { width: 100, height: 10 },
      color: 0x0000ff,
      offset: new Phaser.Math.Vector2(0, -90),
    });
    this.scene.add.existing(bar);
    bar.setFill(0);
    return bar;
  }

  place(shelf: IShelf) {
    const key = shelf.name;
    if (this.occupancy[key] >= shelf.maxCapacity) return;
    const dropped = this.inventory.drop(shelf.accepts);
    if (dropped) {
      this.updateProgress(shelf, dropped.value);
      this.clearWarning(shelf);
      const generator = this.generators[key];
      if (generator) {
        generator.startGenerating();
      }
    }
  }

  async applyCooldown(shelf: IShelf) {
    const key = shelf.name;
    if (this.occupancy[key] <= 0) return;
    if (this.locks[key]) return;

    const hasLockingCapability = shelf.cooldown > 0;
    if (hasLockingCapability) {
      const lock = this.createLock(shelf);
      this.locks[shelf.name] = lock;
      await new Promise((resolve) =>
        this.scene.tweens.addCounter({
          from: 0,
          to: 1,
          duration: shelf.cooldown,
          onStart: () => {
            lock.setFill(0);
          },
          onUpdate: (tween) => {
            const value = tween.getValue();
            lock.setFill(value);
          },
          onComplete: () => {
            const lock = this.locks[shelf.name];
            delete this.locks[shelf.name];
            lock.destroy();
            resolve(true);
          },
        })
      );
    }
  }

  take(shelf: IShelf): IShelf | undefined {
    const key = shelf.name;
    if (this.occupancy[key] <= 0) return undefined;
    if (this.locks[key]) return undefined;

    this.updateProgress(shelf, -shelf.consumption);

    if (!this.generators[key]) {
      this.applyCooldown(shelf);
    }

    if (this.occupancy[key] <= 0) {
      this.showWarning(shelf);
    }

    return shelf;
  }

  showWarning(shelf: IShelf) {
    const warning = this.warnings[shelf.name];
    if (warning.visible) return;

    warning.setVisible(true);

    notificationBus.emit('shelf-empty', {
      shelf,
    });
  }

  clearWarning(shelf: IShelf) {
    const warning = this.warnings[shelf.name];
    if (!warning.visible) return;

    warning.setVisible(false);
    minimapBus.emit('shelf-stocked', { shelf });
  }

  updateProgress(shelf: IShelf, delta: number) {
    this.occupancy[shelf.name] = Phaser.Math.Clamp(
      this.occupancy[shelf.name] + delta,
      0,
      shelf.maxCapacity
    );
    const bar = this.bars[shelf.name];
    const progress = this.occupancy[shelf.name] / shelf.maxCapacity;
    bar.setFill(progress);
    if (!shelf.accepts.length) return;
    if (progress < 1) {
      this.texts[shelf.name].setVisible(false);
    } else if (progress >= 1) {
      this.texts[shelf.name].setVisible(true);
    }
  }

  get(type: ResourceType): IShelf {
    const shelf = Object.values(this.shelf).find(
      (shelf) => shelf.produces === type
    );

    if (!shelf) {
      throw new Error(`No shelf found for resource type ${type}`);
    }
    return shelf;
  }
}
