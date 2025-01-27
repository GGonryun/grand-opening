export type LoadingBarOptions = {
  parent: Phaser.GameObjects.Components.Transform;
  size: { width: number; height: number };
  offset: Phaser.Math.Vector2;
  color: number;
};

export class LoadingBar extends Phaser.GameObjects.Container {
  options: LoadingBarOptions;
  bar: Phaser.GameObjects.Rectangle;
  fill: Phaser.GameObjects.Rectangle;
  constructor(scene: Phaser.Scene, options: LoadingBarOptions) {
    super(
      scene,
      options.parent.x + options.offset.x,
      options.parent.y + options.offset.y
    );
    this.options = options;

    this.bar = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      this.options.size.width,
      this.options.size.height,
      0xffffff
    ).setOrigin(0.5);

    this.add(this.bar);

    this.fill = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      this.options.size.width,
      this.options.size.height,
      this.options.color
    ).setOrigin(0.5);
    this.add(this.fill);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  override update() {
    this.x = this.options.parent.x + this.options.offset.x;
    this.y = this.options.parent.y + this.options.offset.y;
  }

  setFill(percent: number) {
    this.fill.width = percent * this.options.size.width;
  }
}
