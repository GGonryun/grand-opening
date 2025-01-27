import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TypedEventEmitter } from 'shared';
import { InteractionPlane } from './interaction-plane';
import { TargetingRing } from './targeting-ring';
import { Movement } from '../types';

export class PlayerInput extends Phaser.GameObjects.Container {
  interactionPlane: InteractionPlane;
  targeting: TargetingRing;
  bus: TypedEventEmitter<{
    movement: [Movement];
    'stop-movement': [];
  }>;
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.bus = new TypedEventEmitter();

    this.create();
  }

  create() {
    this.createTargeting();
    this.createInteractionPlane();
  }

  createTargeting() {
    this.targeting = new TargetingRing(this.scene);
    this.targeting.hide();
    this.add(this.targeting);
  }

  createInteractionPlane() {
    this.interactionPlane = new InteractionPlane(
      this.scene,
      GAME_WIDTH,
      GAME_HEIGHT
    );

    this.add(this.interactionPlane);

    this.interactionPlane.bus.on('onDragStart', this.onDragStart, this);
    this.interactionPlane.bus.on('onDrag', this.onDrag, this);
    this.interactionPlane.bus.on('onDragEnd', this.onDragEnd, this);
  }

  onDragStart(pointer: Phaser.Input.Pointer) {
    this.targeting.show();
    this.targeting.setPosition(pointer.x, pointer.y);
  }

  onDrag(pointer: Phaser.Input.Pointer) {
    this.bus.emit('movement', this.targeting.setLocation(pointer));
  }

  onDragEnd() {
    this.targeting.hide();
    this.bus.emit('stop-movement');
  }
}
