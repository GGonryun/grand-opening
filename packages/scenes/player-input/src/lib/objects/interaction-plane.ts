import { TypedEventEmitter } from 'shared';

export class InteractionPlane extends Phaser.GameObjects.Rectangle {
  static Debug = false;

  bus: TypedEventEmitter<{
    onDragStart: [Phaser.Input.Pointer];
    onDrag: [Phaser.Input.Pointer];
    onDragEnd: [Phaser.Input.Pointer];
  }>;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    super(
      scene,
      0,
      0,
      width,
      height,
      0xff0000,
      InteractionPlane.Debug ? 0.5 : 0
    );
    this.bus = new TypedEventEmitter();

    this.setOrigin(0);
    this.setInteractive({ draggable: true });
    this.on(Phaser.Input.Events.DRAG, this.onDrag, this);
    this.on(Phaser.Input.Events.DRAG_END, this.onDragEnd, this);
    this.on(Phaser.Input.Events.DRAG_START, this.onDragStart, this);
  }

  onDragStart(pointer: Phaser.Input.Pointer) {
    this.bus.emit('onDragStart', pointer);
  }

  onDrag(pointer: Phaser.Input.Pointer) {
    this.bus.emit('onDrag', pointer);
  }

  onDragEnd(pointer: Phaser.Input.Pointer) {
    this.bus.emit('onDragEnd', pointer);
  }
}
