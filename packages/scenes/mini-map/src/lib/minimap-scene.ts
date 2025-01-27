import Phaser from 'phaser';
import { notificationBus } from 'scenes/notifications';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TypedEventEmitter,
  IResource,
  IShelf,
} from 'shared';

export const minimapBus = new TypedEventEmitter<{
  'resource-online': [
    MiniMapBubbleOptions & {
      name: string;
    }
  ];
  'shelf-stocked': [{ shelf: IShelf }];
  'resource-claimed': [IResource];
  'resource-generated': [MiniMapBubbleOptions & { name: string }];
  'customer-takes-from-shelf': [{ customerId: string; shelf: IShelf }];
}>();

export class OutlineBubble extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    options: Pick<MiniMapBubbleOptions, 'type'>
  ) {
    const fillColor = options.type === 'resource' ? 0xb6ceb7 : 0xf0c2bb;
    const outlineColor = options.type === 'resource' ? 0x2fbb34 : 0xbb342f;
    const circle = new Phaser.GameObjects.Ellipse(
      scene,
      0,
      0,
      64,
      64,
      fillColor
    );
    const innerCircle = new Phaser.GameObjects.Ellipse(
      scene,
      0,
      0,
      62,
      62,
      fillColor
    );
    const triangle = new Phaser.GameObjects.Triangle(
      scene,
      0,
      32,
      0,
      0,
      24,
      0,
      12,
      24,
      fillColor
    );
    super(scene, 0, 0, [circle, triangle, innerCircle]);
    circle.setStrokeStyle(2, outlineColor);
    triangle.setStrokeStyle(2, outlineColor);
  }
}

export type MiniMapBubbleOptions = {
  worldX: number;
  worldY: number;
  texture: string;
  type: 'resource' | 'shelf';
};
export class MiniMapBubble extends Phaser.GameObjects.Container {
  options: MiniMapBubbleOptions;
  outline: OutlineBubble;
  sprite: Phaser.GameObjects.Sprite;
  icon: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, options: MiniMapBubbleOptions) {
    super(scene, options.worldX, options.worldY);
    this.options = options;
    this.sprite = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      options.texture
    ).setScale(0.4);
    this.outline = new OutlineBubble(scene, options);
    this.icon = new Phaser.GameObjects.Sprite(
      scene,
      24,
      -24,
      options.type === 'resource' ? 'check' : 'cross'
    ).setScale(0.25);

    this.add(this.outline);
    this.add(this.sprite);
    this.add(this.icon);

    // shake the whole thing a bit.
    this.scene.tweens.add({
      targets: this,
      x: `+=1`,
      y: `+=1`,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });

    this.scene.tweens.add({
      targets: this.outline,
      angle: `-=10`,
      duration: 300,
      yoyo: true,
      repeat: -1,
    });
    this.scene.tweens.add({
      targets: this.sprite,
      // pulse
      scale: `+=0.1`,
      duration: 500,
      yoyo: true,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
    });
  }
}

export const LOCATIONS = {
  'battery-station-1': {
    worldX: -48,
    worldY: 96,
    texture: 'battery',
    type: 'resource',
  },
  'strawberry-patch-1': {
    worldX: GAME_WIDTH / 2,
    worldY: GAME_HEIGHT - 100,
    texture: 'strawberry',
    type: 'resource',
  },
  'strawberry-patch-2': {
    worldX: GAME_WIDTH / 2 + 75,
    worldY: GAME_HEIGHT - 100,
    texture: 'strawberry',
    type: 'resource',
  },
  'strawberry-patch-3': {
    worldX: GAME_WIDTH / 2 + 150,
    worldY: GAME_HEIGHT - 100,
    texture: 'strawberry',
    type: 'resource',
  },
  'strawberry-patch-4': {
    worldX: GAME_WIDTH / 2 + 225,
    worldY: GAME_HEIGHT - 100,
    texture: 'strawberry',
    type: 'resource',
  },
  'strawberry-patch-5': {
    worldX: GAME_WIDTH / 2 + 300,
    worldY: GAME_HEIGHT - 100,
    texture: 'strawberry',
    type: 'resource',
  },
  'strawberry-shelf': {
    worldX: GAME_WIDTH,
    worldY: GAME_HEIGHT - 500,
    texture: 'strawberry',
    type: 'shelf',
  },
  'cash-register': {
    worldX: 256,
    worldY: 64,
    texture: 'battery',
    type: 'shelf',
  },
  'cow-1': {
    worldX: -250,
    worldY: 450,
    texture: 'strawberry',
    type: 'shelf',
  },
  'cow-2': {
    worldX: -250,
    worldY: 650,
    texture: 'strawberry',
    type: 'shelf',
  },
  fridge: {
    worldX: GAME_WIDTH - 132,
    worldY: 400,
    texture: 'raw-milk',
    type: 'shelf',
  },
  'bubble-tea-station': {
    worldX: -32,
    worldY: GAME_HEIGHT - 320,
    texture: 'raw-milk',
    type: 'shelf',
  },
} as const;

export class MiniMapScene extends Phaser.Scene {
  static Key = 'MiniMapScene';

  bubbles: MiniMapBubble[];

  constructor() {
    super(MiniMapScene.Key);
  }

  create() {
    this.bubbles = Object.entries(LOCATIONS).map(([name, value]) => {
      const bubble = new MiniMapBubble(this, value);
      bubble.setName(name);
      bubble.setActive(true);
      this.add.existing(bubble);
      return bubble;
    });

    notificationBus.on(
      'shelf-empty',
      ({ shelf }) => {
        this.activateBubble(shelf.name);
      },
      this
    );

    minimapBus.on('shelf-stocked', ({ shelf }) => {
      this.deactivateBubble(shelf.name);
    });

    minimapBus.on(
      'resource-online',
      ({ name }) => {
        this.activateBubble(name);
      },
      this
    );

    minimapBus.on(
      'resource-claimed',
      ({ name, cooldown }) => {
        if (!cooldown) {
          // is temporary
          this.removeBubble(name);
        } else {
          this.deactivateBubble(name);
        }
      },
      this
    );

    minimapBus.on(
      'resource-generated',
      (opts) => {
        const { name } = opts;
        if (this.findBubble(name)) {
          this.activateBubble(name);
        } else {
          this.addBubble(name, opts);
        }
      },
      this
    );
  }

  findBubble(name: string) {
    return this.bubbles.find((b) => b.name === name);
  }

  activateBubble(name: string) {
    const bubble = this.findBubble(name);
    if (bubble) {
      bubble.setActive(true);
    }
  }

  deactivateBubble(name: string) {
    const bubble = this.findBubble(name);
    if (bubble) {
      bubble.setActive(false);
    }
  }

  removeBubble(name: string) {
    const bubble = this.findBubble(name);
    if (bubble) {
      bubble.destroy();
      bubble.setVisible(false);
      this.bubbles = this.bubbles.filter((b) => b.name !== name);
    }
  }

  addBubble(name: string, options: MiniMapBubbleOptions) {
    const bubble = new MiniMapBubble(this, options);
    bubble.setName(name);
    this.add.existing(bubble);
    this.bubbles.push(bubble);
  }

  override update() {
    const camera = this.scene.get('GameScene').cameras.main; // Get the main game's camera
    const zoom = camera.zoom; // Get the zoom level

    // Get original screen dimensions (unaffected by zoom)
    const screenWidth = Number(this.sys.game.config.width);
    const screenHeight = Number(this.sys.game.config.height);

    for (const bubble of this.bubbles) {
      // Get the world position of the item
      const worldX = bubble.options.worldX;
      const worldY = bubble.options.worldY;

      // Convert world position to camera space
      const cameraX = worldX - camera.scrollX;
      const cameraY = worldY - camera.scrollY;

      // Check if the item is off-screen (outside camera view)
      if (
        bubble.active &&
        (cameraX < 0 ||
          cameraY < 0 ||
          cameraX > screenWidth ||
          cameraY > screenHeight)
      ) {
        // Calculate angle from the center of the screen to the item's position
        const angle = Phaser.Math.Angle.Between(
          screenWidth / 2,
          screenHeight / 2,
          cameraX,
          cameraY
        );

        // Set offsets for horizontal and vertical padding
        const xOffset = 45; // Adjust horizontal padding
        const yOffset = 45; // Adjust vertical padding

        let edgeX = screenWidth / 2;
        let edgeY = screenHeight / 2;

        // Calculate slope to determine which edge to clamp to
        const slope = Math.abs(Math.tan(angle));

        if (slope > screenHeight / screenWidth) {
          // Clamping to top/bottom edges
          edgeY = angle > 0 ? screenHeight - yOffset : yOffset; // Bottom or top edge
          edgeX =
            screenWidth / 2 + (edgeY - screenHeight / 2) / Math.tan(angle);
        } else {
          // Clamping to left/right edges
          edgeX =
            angle > -Math.PI / 2 && angle < Math.PI / 2
              ? screenWidth - xOffset
              : xOffset; // Right or left edge
          edgeY =
            screenHeight / 2 + Math.tan(angle) * (edgeX - screenWidth / 2);
        }

        // Adjust for zoom by scaling the edge positions
        edgeX = edgeX * zoom;
        edgeY = edgeY * zoom;

        // Update the icon's position based on zoom-adjusted clamped values
        bubble.setPosition(edgeX, edgeY).setVisible(true);
        bubble.outline.setRotation(angle - Math.PI / 2);
      } else {
        // Hide icon if the item is on-screen
        bubble.setVisible(false);
        // bubble.setActive(false);
      }
    }
  }
}
