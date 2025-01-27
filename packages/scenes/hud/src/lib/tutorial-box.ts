import { GAME_HEIGHT, GAME_WIDTH, TypedEventEmitter } from 'shared';

const INSTRUCTIONS = [
  {
    image: 'screenshot-1',
    message: 'Tap anywhere to move your character.',
  },
  {
    image: 'screenshot-2',
    message: 'Collect up to 5 resources and bring them to a shelf.',
  },
  {
    image: 'screenshot-3',
    message: 'Customers will line up at the shelf.',
  },
  {
    image: 'screenshot-4',
    message: 'Feed cows strawberries to produce milk.',
  },
  {
    image: 'screenshot-5',
    message: 'Throw away any unwanted resources in the trash can.',
  },
  {
    image: 'screenshot-6',
    message: "Don't stress out. You can't lose!",
  },
];

const stroke = 0x464e47;
export class TutorialBox extends Phaser.GameObjects.Container {
  bus: TypedEventEmitter<{ hide: [] }>;
  step: number;
  cross: Phaser.GameObjects.Sprite;
  message: Phaser.GameObjects.Text;
  image: ImageBox;
  finger: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene.add.existing(this);
    this.bus = new TypedEventEmitter();
    this.step = 0;
    this.create();
  }

  create() {
    const gap = 16;
    const sizeY = 230;
    const rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      GAME_WIDTH / 2,
      GAME_HEIGHT - sizeY / 2 - gap,
      GAME_WIDTH - gap * 2,
      sizeY,
      0xb6ceb7,
      0.5
    ).setStrokeStyle(4, stroke);
    this.add(rectangle);

    this.cross = new Phaser.GameObjects.Sprite(
      this.scene,
      rectangle.x + rectangle.width / 2 - 64,
      rectangle.y + rectangle.height / 2 - 64,
      'cross'
    )
      .setScale(0.85)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.tweens.add({
          targets: this,
          y: 256,
          duration: 1250,
          ease: Phaser.Math.Easing.Back.In,
          onComplete: () => {
            this.bus.emit('hide');
          },
        });
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 1250,
          ease: Phaser.Math.Easing.Sine.In,
        });
      });

    this.cross.setVisible(false);
    this.add(this.cross);

    const instruction = INSTRUCTIONS[this.step];

    this.image = new ImageBox(
      this.scene,
      134,
      GAME_HEIGHT - sizeY / 2 - gap,
      instruction.image
    ).setScale(0.75);

    this.add(this.image);

    this.message = new Phaser.GameObjects.Text(
      this.scene,
      256,
      rectangle.y - rectangle.height / 2 + 16,
      instruction.message,
      {
        fontSize: '32px',
        fontStyle: 'bold',
        stroke: '#000000',
        align: 'left',
        color: '#ffffff',
        strokeThickness: 6,
        wordWrap: { width: 420 },
        fixedWidth: 420,
      }
    ).setOrigin(0);

    this.add(this.message);

    this.finger = new Phaser.GameObjects.Sprite(
      this.scene,
      rectangle.x + rectangle.width / 2 - 64,
      rectangle.y + rectangle.height / 2 - 64,
      'next'
    )
      .setScale(1)
      .setAngle(90)
      .setFlipX(true)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.step < INSTRUCTIONS.length - 1) {
          this.step++;
          this.renderStep();
        }
        if (this.step === INSTRUCTIONS.length - 1) {
          this.cross.setVisible(true);
          this.finger.setVisible(false);
        }
      });

    this.scene.tweens.add({
      targets: this.finger,
      x: `-=32`,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: Phaser.Math.Easing.Back.Out,
    });
    this.add(this.finger);
  }

  renderStep() {
    const instruction = INSTRUCTIONS[this.step];
    this.image.sprite.setTexture(instruction.image);
    this.message.setText(instruction.message);
  }

  reset() {
    this.step = 0;
    this.renderStep();
    this.cross.setVisible(false);
    this.finger.setVisible(true);
    this.scene.tweens.add({
      targets: this,
      y: 0,
      alpha: 1,
      duration: 1250,
      ease: Phaser.Math.Easing.Back.Out,
    });
  }
}

class ImageBox extends Phaser.GameObjects.Container {
  image: string;
  sprite: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, x: number, y: number, image: string) {
    super(scene, x, y);

    this.image = image;

    this.create();
  }

  create() {
    this.sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, this.image);
    const imageBorder = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.sprite.x - this.sprite.width / 2 - 4,
      this.sprite.y - this.sprite.height / 2 - 4,
      this.sprite.width + 8,
      this.sprite.height + 8,
      0xffffff
    ).setStrokeStyle(6, stroke);
    imageBorder.setOrigin(0, 0);
    this.add(imageBorder);
    this.add(this.sprite);
  }
}
