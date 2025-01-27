import { TypedEventEmitter } from 'shared';
import { PlayerInput } from './objects/player-input';
import { Movement } from './types';

export const sceneBus = new TypedEventEmitter<{
  movement: [Movement];
  'stop-movement': [];
}>();

export class PlayerInputScene extends Phaser.Scene {
  static Key = 'PlayerInputScene';

  controller: PlayerInput;

  constructor() {
    super(PlayerInputScene.Key);
  }

  create() {
    this.controller = new PlayerInput(this);
    this.add.existing(this.controller);

    this.controller.bus.on('movement', (movement) => {
      sceneBus.emit('movement', movement);
    });

    this.controller.bus.on('stop-movement', () => {
      sceneBus.emit('stop-movement');
    });
  }
}
