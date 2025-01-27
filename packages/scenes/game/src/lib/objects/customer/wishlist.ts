import { ICON_SIZE } from 'shared';
import { Customer } from './customer';
import { ShoppingPlanItem } from './shopping-plan';

export type WishlistOptions = { parent: Customer };

export class Wishlist extends Phaser.GameObjects.Container {
  options: WishlistOptions;
  bubble: SpeechBubble;
  icon: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  constructor(scene: Phaser.Scene, options: WishlistOptions) {
    super(scene);
    this.options = options;

    this.create();
    this.setScale(0.75);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  override destroy(fromScene?: boolean): void {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    super.destroy(fromScene);
  }

  create() {
    this.bubble = new SpeechBubble(this.scene);
    this.add(this.bubble);

    this.icon = new Phaser.GameObjects.Sprite(
      this.scene,
      -32,
      0,
      'question'
    ).setScale(0.25);
    this.add(this.icon);

    this.text = new Phaser.GameObjects.Text(this.scene, 18, 2, `?/?`, {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5, 0.5);
    this.add(this.text);

    this.hide();
  }

  override update() {
    const { x, y } = this.options.parent;
    this.setPosition(x, y - 64);
  }

  show(item: ShoppingPlanItem) {
    this.bubble.setVisible(true);
    this.icon.setVisible(true);
    this.text.setVisible(true);

    this.icon.setTexture(item.key);
    this.text.setText(`${item.acquired}/${item.required}`);
  }

  hide() {
    this.bubble.setVisible(false);
    this.icon.setVisible(false);
    this.text.setVisible(false);
  }
}

class SpeechBubble extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.create();
  }

  create() {
    const speechBubbleColor = 0xffffff;
    const speechBubbleOutlineColor = 0x00ff00;

    const bubble = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      ICON_SIZE,
      40,
      speechBubbleColor
    );
    bubble.setStrokeStyle(4, speechBubbleOutlineColor);
    this.add(bubble);

    const angle = new Phaser.GameObjects.Triangle(
      this.scene,
      0,
      16,
      0,
      32,
      32,
      0,
      32,
      32,
      speechBubbleColor
    );
    angle.setAngle(45);
    angle.setStrokeStyle(4, speechBubbleOutlineColor);
    this.add(angle);

    const box = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      8,
      64,
      20,
      speechBubbleColor
    );
    this.add(box);
  }
}
