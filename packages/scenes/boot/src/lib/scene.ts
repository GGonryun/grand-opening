import Phaser from 'phaser';
import { GameScene } from 'scenes/game';
import { PlayerInputScene } from 'scenes/player-input';
import { MiniMapScene } from 'scenes/mini-map';
import { NotificationsScene } from 'scenes/notifications';
import { HudScene } from 'scenes/hud';

export class BootScene extends Phaser.Scene {
  static Key = 'BootScene';
  constructor() {
    super(BootScene.Key);
  }

  preload() {
    this.load.setPath('assets');
    // sprites
    this.load.image('novice', 'novice.png');
    this.load.image('strawberry', 'strawberry.png');
    this.load.image('shelf', 'shelf.png');
    this.load.image('register', 'register.png');
    this.load.image('question', 'question.png');
    this.load.image('battery', 'battery.png');
    this.load.image('door', 'door.png');
    this.load.image('trash', 'trash.png');
    this.load.image('gold', 'gold.png');
    this.load.image('corn', 'corn.png');
    this.load.image('cow', 'cow.png');
    this.load.image('raw-milk', 'milk.png');
    this.load.image('cold-milk', 'milk.png');
    this.load.image('tea-machine', 'tea-machine.png');
    this.load.image('bubble-tea', 'bubble-tea.png');
    this.load.image('fridge', 'fridge.png');
    this.load.image('check', 'check.png');
    this.load.image('cross', 'cross.png');
    this.load.image('next', 'next.png');
    this.load.image('info', 'info.png');
    for (let i = 1; i <= 3; i++) {
      this.load.image(`slime-${i}`, `slime-${i}.png`);
      this.load.audio(`slime-${i}`, `slime-${i}.mp3`);
    }
    // particles
    this.load.image('yellow-particle', 'yellow-particle.png');
    // tutorial
    for (let i = 1; i <= 6; i++) {
      this.load.image(`screenshot-${i}`, `screenshot-${i}.png`);
    }
    // tiles
    this.load.image('tile-dirt', 'tile-dirt.png');
    this.load.image('tile-light', 'tile-light.png');
    for (let i = 0; i < 9; i++) {
      this.load.image(`tile-${i}`, `tile-${i}.png`);
    }
    // audio
    this.load.audio('music', 'music.mp3');
    this.load.audio('cash-register', 'cash-register.mp3');
    this.load.audio('ding', 'ding.mp3');

    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      this.scene.start(GameScene.Key);
      this.scene.launch(PlayerInputScene.Key);
      this.scene.launch(MiniMapScene.Key);
      this.scene.launch(NotificationsScene.Key);
      this.scene.launch(HudScene.Key);
    });
  }
}
