import { GameScene } from 'scenes/game';
import { minimapBus } from 'scenes/mini-map';
import {
  ElementDepths,
  GAME_HEIGHT,
  GAME_WIDTH,
  GOLD_SCALE,
  Point,
} from 'shared';
import { TutorialBox } from './tutorial-box';

export class HudScene extends Phaser.Scene {
  static Key = 'hud';
  goldTween: Phaser.Tweens.Tween | undefined;
  text: Phaser.GameObjects.Text;
  currentGold: number;
  targetGold: number;
  constructor() {
    super(HudScene.Key);

    this.currentGold = 0;
    this.targetGold = 0;
  }

  create() {
    this.add
      .rectangle(16, 16, 128, 32, 0xc2bbf0)
      .setOrigin(0)
      .setStrokeStyle(2, 0x000000);

    this.add.sprite(32, 32, 'gold').setScale(0.5);

    this.text = this.add
      .text(64, 16, '0', {
        fontSize: '28px',
        color: '#000',
        align: 'center',
        stroke: '#fff',
        strokeThickness: 4,
      })
      .setOrigin(0, 0);

    const tutorialBox = new TutorialBox(this);

    const info = this.add
      .sprite(GAME_WIDTH - 64, GAME_HEIGHT - 64, 'info')
      .setScale(0.75)
      .setAlpha(0)
      .setInteractive()
      .on('pointerdown', () => {
        tutorialBox.reset();
        this.tweens.add({
          targets: info,
          alpha: 0,
          duration: 250,
        });
      });

    tutorialBox.bus.on('hide', () => {
      this.tweens.add({
        targets: info,
        alpha: 1,
        duration: 500,
      });
    });

    minimapBus.on('resource-claimed', ({ resourceType, x, y }) => {
      if (resourceType === 'gold') {
        const camera = this.scene.get(GameScene.Key).cameras.main;
        const adjustedX = x + -camera.scrollX;
        const adjustedY = y + -camera.scrollY;
        camera.shake(100, 0.005);

        this.sendGold({
          from: { x: adjustedX, y: adjustedY },
          to: { x: 32, y: 32 },
        });
      }
    });
  }

  async sendGold(data: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }) {
    const DURATION = 1500;
    const gold = this.add
      .sprite(data.from.x, data.from.y, 'gold')
      .setScale(GOLD_SCALE);

    const emitter = this.add.particles(0, 0, 'yellow-particle', {
      x: data.from.x,
      y: data.from.y,
      quantity: 1,
      speed: 100,
      frequency: 100,
      lifespan: DURATION,
      scale: 0.15,
      alpha: { start: 1, end: 0 },
      emitting: false,
    });
    emitter.setDepth(ElementDepths.Particles);

    const xVals = [data.from.x, data.to.x];
    const yVals = [data.from.y, data.to.y];
    const half = randomizeHalfPoint(data.to);
    xVals.splice(1, 0, half.x);
    yVals.splice(1, 0, half.y);

    return new Promise((resolve) =>
      this.tweens.addCounter({
        from: 0,
        to: 1,
        ease: Phaser.Math.Easing.Sine.InOut,
        duration: DURATION,
        onUpdate: (tween) => {
          const v = tween.getValue();
          const x = Phaser.Math.Interpolation.CatmullRom(xVals, v);
          const y = Phaser.Math.Interpolation.CatmullRom(yVals, v);

          emitter.emitParticleAt(x, y);
          gold.setPosition(x, y);
        },
        onComplete: () => {
          emitter.stop();
          gold.destroy();
          resolve(true);
          this.incrementGold();
          this.time.delayedCall(1000, () => {
            emitter.destroy();
          });
        },
      })
    );
  }

  incrementGold() {
    this.targetGold += 1;
    if (this.goldTween) {
      this.goldTween.stop();
      this.goldTween = undefined;
    }
    this.goldTween = this.tweens.addCounter({
      from: this.currentGold,
      to: this.targetGold,
      duration: 250,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.text.setText(value.toString());
      },
      onComplete: () => {
        this.currentGold = this.targetGold;
      },
    });
  }
}

export const randomizeHalfPoint = (point: Point): Point => {
  const minX = point.x / 2;
  const maxX = point.x + (point.x - minX);
  const minY = point.y / 2;
  const maxY = point.y + (point.y - minY);
  return {
    x: Phaser.Math.Between(minX, maxX),
    y: Phaser.Math.Between(minY, maxY),
  };
};
