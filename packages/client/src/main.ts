import Phaser from 'phaser';
import { BootScene } from 'scenes/boot';
import { GameScene } from 'scenes/game';
import { MiniMapScene } from 'scenes/mini-map';
import { PlayerInputScene } from 'scenes/player-input';
import { NotificationsScene } from 'scenes/notifications';
import { GAME_BACKGROUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from 'shared';
import { HudScene } from 'scenes/hud';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL, // Force WebGL rendering
  scale: {
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
    },
  },
  backgroundColor: GAME_BACKGROUND_COLOR,
  pixelArt: false,
  scene: [
    BootScene,
    GameScene,
    PlayerInputScene,
    MiniMapScene,
    NotificationsScene,
    HudScene,
  ],
};

const game = new Phaser.Game(config);

export default game;
