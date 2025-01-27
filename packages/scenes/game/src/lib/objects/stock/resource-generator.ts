import { minimapBus } from 'scenes/mini-map';
import { IShelf } from 'shared';
import { LoadingBar } from '../shared/loading-bar';
import { StockSystem } from './stock-system';

export class ResourceGenerator {
  stock: StockSystem;
  shelf: IShelf;
  bar: LoadingBar;
  generator: Phaser.Tweens.Tween | undefined;
  constructor(stock: StockSystem, shelf: IShelf) {
    this.stock = stock;
    this.shelf = shelf;

    const bar = new LoadingBar(this.stock.scene, {
      parent: this.shelf,
      size: { width: 100, height: 10 },
      color: 0x0000ff,
      offset: new Phaser.Math.Vector2(0, -90),
    });
    this.stock.scene.add.existing(bar);
    bar.setFill(0);
    bar.setVisible(false);
    this.bar = bar;
  }

  startGenerating() {
    if (this.generator) return;

    this.generator = this.stock.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: this.shelf.cooldown,
      onStart: () => {
        this.bar.setVisible(true);
        this.bar.setFill(0);
      },
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.bar.setFill(value);
      },
      onComplete: () => {
        this.generator = undefined;
        this.generate();
        this.bar.setVisible(false);
      },
    });
  }

  generate() {
    this.generator = undefined;

    if (!this.shelf.generates) return;
    const take = this.stock.take(this.shelf);
    if (!take) return;

    const resource = this.shelf.generates(this.stock.scene.matter.world);
    resource.setPosition(
      Phaser.Math.Between(-128, 128) + this.shelf.x,
      Phaser.Math.Between(-128, 128) + this.shelf.y
    );
    this.stock.scene.add.existing(resource);
    this.stock.resources.register(resource);

    minimapBus.emit('resource-generated', {
      name: resource.name,
      texture: resource.resourceTexture,
      worldX: resource.x,
      worldY: resource.y,
      type: 'resource',
    });

    this.startGenerating();
  }
}
