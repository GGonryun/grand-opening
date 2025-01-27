import { GAME_WIDTH, IShelf, TypedEventEmitter } from 'shared';

export type Notification = {
  message: string;
  texture: string;
};

export const notificationBus = new TypedEventEmitter<{
  'line-is-starting': [{ shelf: IShelf; length: number }];
  'shelf-empty': [{ shelf: IShelf }];
}>();

export class NotificationsScene extends Phaser.Scene {
  static Key = 'notifications';

  tween: Phaser.Tweens.Tween | undefined;

  constructor() {
    super({ key: NotificationsScene.Key });
  }

  create() {
    notificationBus.on('line-is-starting', (opts) => {
      if (opts.shelf.selfTexture === 'register' && opts.length < 3) return;
      const message = this.lineStartingMessage(opts.shelf);
      this.createNotification({ message, texture: opts.shelf.selfTexture });
    });

    notificationBus.on('shelf-empty', (opts) => {
      const message = this.emptyShelfMessage(opts.shelf);
      this.createNotification({ message, texture: opts.shelf.selfTexture });
    });
  }

  lineStartingMessage(shelf: IShelf) {
    return `A line is growing at the ${shelf.label}!`;
  }

  emptyShelfMessage(shelf: IShelf) {
    if (shelf.selfTexture === 'tea-machine') {
      return 'The tea machine is out of milk!';
    }

    if (shelf.selfTexture === 'register') {
      return 'The cash register ran out of power! Bring more batteries!';
    }

    if (shelf.selfTexture === 'cow') {
      return 'The cows are hungry! Bring more strawberries!';
    }

    if (shelf.selfTexture === 'fridge') {
      return 'The fridge is out of milk!';
    }

    if (shelf.selfTexture === 'shelf') {
      return 'The strawberry shelf is empty! Bring more strawberries!';
    }

    return `The ${shelf.label} is empty!`;
  }

  createNotification({ texture, message }: Notification) {
    this.sound.play('ding', {
      volume: 0.4,
    });
    const speed = 1500;
    const destination = 128;

    const square = new NotificationSquare(this, {
      texture,
      message,
    });
    this.add.existing(square);

    this.tweens.add({
      targets: square,
      x: GAME_WIDTH / 2,
      y: destination,
      duration: speed,
      ease: Phaser.Math.Easing.Bounce.Out,
      callbackScope: this,
      onComplete: () => {
        this.tweens.add({
          targets: square,
          delay: 5000,
          y: -destination,
          duration: speed / 2,
          ease: Phaser.Math.Easing.Cubic.In,
          callbackScope: this,
          onComplete: () => {
            square.destroy();
          },
        });
      },
    });
  }
}

type NotificationSquareOptions = {
  texture: string;
  message: string;
};

class NotificationSquare extends Phaser.GameObjects.Container {
  options: NotificationSquareOptions;

  constructor(scene: Phaser.Scene, options: NotificationSquareOptions) {
    super(scene, GAME_WIDTH / 2, -128);

    this.options = options;

    this.create();
  }

  create() {
    const square = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      GAME_WIDTH - 128,
      72,

      0xf6f3a9
    ).setStrokeStyle(4, 0x000000);
    this.add(square);

    const icon = new Phaser.GameObjects.Sprite(
      this.scene,
      -280,
      0,
      this.options.texture
    )
      .setOrigin(0, 0.5)
      .setScale(0.5);
    this.add(icon);

    const text = new Phaser.GameObjects.Text(
      this.scene,
      44,
      0,
      this.options.message,
      {
        fontSize: '24px',
        color: '#000000',
        stroke: '#ffffff',
        strokeThickness: 4,
        wordWrap: { width: 500 },
        fixedWidth: 500,
      }
    );
    text.setOrigin(0.5);
    this.add(text);
  }
}
