import Phaser from 'phaser';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  IResource,
  IShelf,
  Point,
  TypedEventEmitter,
} from 'shared';

import { Player } from './objects/player/player';

import { Customer } from './objects/customer/customer';
import { CustomersSystem } from './objects/customer/customers-system';
import { CashRegister } from './objects/stock/cash-register';
import { StrawberryShelf } from './objects/stock/strawberry-shelf';
import { StoreDoor } from './objects/stock/store-door';
import { Inventory } from './objects/player/inventory';
import { BatteryStation } from './objects/resources/battery-station';
import { StrawberryPatch } from './objects/resources/strawberry-patch';
import { TrashCan } from './objects/stock/trash-can';
import { ProducerSystem } from './objects/producers/producer-system';
import { Cow } from './objects/stock/cow';
import { Fridge } from './objects/stock/fridge';
import { BubbleTeaStation } from './objects/stock/bubble-tea-station';
import { sceneBus } from 'scenes/player-input';
import { LOCATIONS, minimapBus } from 'scenes/mini-map';
import { BackgroundFloor } from './objects/world/floor';
import { ResourcesSystem } from './objects/resources/resources-system';
import { StockSystem } from './objects/stock/stock-system';
import { GoldCoin } from './objects/resources/gold-coin';

type GameEvents = {
  'player-resource-collision': [
    {
      resource: IResource;
      player: Player;
    }
  ];
  'player-shelf-collision': [
    {
      shelf: IShelf;
      player: Player;
    }
  ];
  'customer-shelf-collision': [
    {
      shelf: IShelf;
      customer: Customer;
    }
  ];
};

export class GameScene extends Phaser.Scene {
  static Key = 'GameScene';
  bus: TypedEventEmitter<GameEvents>;
  world: Phaser.Physics.Matter.World;
  player: Player;
  inventory: Inventory;
  resources: ResourcesSystem;
  stock: StockSystem;
  customers: CustomersSystem;
  producers: ProducerSystem;
  floor: BackgroundFloor;

  constructor() {
    super(GameScene.Key);
  }

  create() {
    this.bus = new TypedEventEmitter();

    this.world = this.matter.world.disableGravity();

    this.floor = new BackgroundFloor(this);

    this.player = new Player(this.world, GAME_WIDTH / 2, GAME_HEIGHT - 300);

    this.add.existing(this.player);

    this.inventory = new Inventory(this, this.player);
    this.add.existing(this.inventory);

    this.resources = new ResourcesSystem(this, this.inventory);
    this.stock = new StockSystem(this, this.inventory, this.resources);
    this.customers = new CustomersSystem(this, this.stock);
    this.producers = new ProducerSystem(this, this.inventory);

    this.createZones();
    this.createEvents();

    // make the camera follow the player.
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // play audio
    const music = this.sound.add('music', { volume: 0.5, loop: true });
    music.play();

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        const slime = `slime-${Phaser.Math.RND.pick([1, 2, 3])}`;
        this.sound.play(slime, {
          volume: 0.25,
        });
      },
      loop: true,
    });
  }

  createZones() {
    const batteryLocation = LOCATIONS['battery-station-1'];
    this.add
      .sprite(batteryLocation.worldX, batteryLocation.worldY, 'tile-light')
      .setScale(0.5);
    const batteryStation1 = new BatteryStation(
      this.world,
      batteryLocation.worldX,
      batteryLocation.worldY
    ).setName('battery-station-1');
    this.add.existing(batteryStation1);
    this.resources.register(batteryStation1);

    const strawberryPatch1Location = LOCATIONS['strawberry-patch-1'];
    this.add
      .sprite(
        strawberryPatch1Location.worldX,
        strawberryPatch1Location.worldY,
        'tile-dirt'
      )
      .setScale(0.6);
    const strawberryPatch1 = new StrawberryPatch(
      this.world,
      strawberryPatch1Location.worldX,
      strawberryPatch1Location.worldY
    ).setName('strawberry-patch-1');
    this.add.existing(strawberryPatch1);
    this.resources.register(strawberryPatch1);

    const strawberryPatch2Location = LOCATIONS['strawberry-patch-2'];
    this.add
      .sprite(
        strawberryPatch2Location.worldX,
        strawberryPatch2Location.worldY,
        'tile-dirt'
      )
      .setScale(0.6);
    const strawberryPatch2 = new StrawberryPatch(
      this.world,
      strawberryPatch2Location.worldX,
      strawberryPatch2Location.worldY
    ).setName('strawberry-patch-2');
    this.add.existing(strawberryPatch2);
    this.resources.register(strawberryPatch2);

    const strawberryPatch3Location = LOCATIONS['strawberry-patch-3'];
    this.add
      .sprite(
        strawberryPatch3Location.worldX,
        strawberryPatch3Location.worldY,
        'tile-dirt'
      )
      .setScale(0.6);
    const strawberryPatch3 = new StrawberryPatch(
      this.world,
      strawberryPatch3Location.worldX,
      strawberryPatch3Location.worldY
    ).setName('strawberry-patch-3');
    this.add.existing(strawberryPatch3);
    this.resources.register(strawberryPatch3);

    const strawberryPatch4Location = LOCATIONS['strawberry-patch-4'];
    this.add
      .sprite(
        strawberryPatch4Location.worldX,
        strawberryPatch4Location.worldY,
        'tile-dirt'
      )
      .setName('strawberry-patch-4')
      .setScale(0.6);
    const strawberryPatch4 = new StrawberryPatch(
      this.world,
      strawberryPatch4Location.worldX,
      strawberryPatch4Location.worldY
    ).setName('strawberry-patch-4');
    this.add.existing(strawberryPatch4);
    this.resources.register(strawberryPatch4);

    const strawberryPatch55Location = LOCATIONS['strawberry-patch-5'];
    this.add
      .sprite(
        strawberryPatch55Location.worldX,
        strawberryPatch55Location.worldY,
        'tile-dirt'
      )
      .setScale(0.6);
    const strawberryPatch5 = new StrawberryPatch(
      this.world,
      strawberryPatch55Location.worldX,
      strawberryPatch55Location.worldY
    ).setName('strawberry-patch-5');
    this.add.existing(strawberryPatch5);
    this.resources.register(strawberryPatch5);

    const strawberryShelfLocation = LOCATIONS['strawberry-shelf'];
    const strawberryShelf = new StrawberryShelf(
      this.world,
      strawberryShelfLocation.worldX,
      strawberryShelfLocation.worldY
    ).setName('strawberry-shelf');
    this.add.existing(strawberryShelf);
    this.stock.register(strawberryShelf);

    const cashRegisterLocation = LOCATIONS['cash-register'];
    const register = new CashRegister(
      this.world,
      cashRegisterLocation.worldX,
      cashRegisterLocation.worldY
    ).setName('cash-register');
    this.add.existing(register);
    this.stock.register(register);

    const door = new StoreDoor(this.world, GAME_WIDTH / 2, -256 - 64).setName(
      'store-door'
    );
    this.add.existing(door);
    this.stock.register(door);

    const trash = new TrashCan(this.world, GAME_WIDTH, -64).setName(
      'trash-can'
    );
    this.add.existing(trash);
    this.stock.register(trash);

    const cow1Location = LOCATIONS['cow-1'];
    this.add
      .sprite(cow1Location.worldX, cow1Location.worldY, 'tile-dirt')
      .setScale(1.2);
    const cow1 = new Cow(
      this.world,
      cow1Location.worldX,
      cow1Location.worldY
    ).setName('cow-1');
    this.add.existing(cow1);
    this.stock.register(cow1);

    const cow2Location = LOCATIONS['cow-2'];
    this.add
      .sprite(cow2Location.worldX, cow2Location.worldY, 'tile-dirt')
      .setScale(1.2);
    const cow2 = new Cow(
      this.world,
      cow2Location.worldX,
      cow2Location.worldY
    ).setName('cow-2');
    this.add.existing(cow2);
    this.stock.register(cow2);

    const fridgeLocation = LOCATIONS['fridge'];
    const fridge = new Fridge(
      this.world,
      fridgeLocation.worldX,
      fridgeLocation.worldY
    ).setName('fridge');
    this.add.existing(fridge);
    this.stock.register(fridge);

    const stationLocation = LOCATIONS['bubble-tea-station'];
    const station = new BubbleTeaStation(
      this.world,
      stationLocation.worldX,
      stationLocation.worldY
    ).setName('bubble-tea-station');
    this.add.existing(station);
    this.stock.register(station);
  }

  createEvents() {
    this.matter.world.on(
      // Normally this would be COLLISION_START, but we want
      // to allow users to stand on the strawberries and continuously
      // collect them. Make sure this doesn't cause any bugs because of
      // the continuous collision events.
      Phaser.Physics.Matter.Events.COLLISION_ACTIVE,
      (event) => {
        for (const pair of event.pairs) {
          if (!pair.bodyA.gameObject || !pair.bodyB.gameObject) {
            return;
          }

          this.normalizeCollision(pair.bodyA.gameObject, pair.bodyB.gameObject);
        }
      }
    );

    sceneBus.on('movement', (movement) => {
      this.player.setSpeed(movement);
    });

    sceneBus.on('stop-movement', () => {
      this.player.stopMovement();
    });

    this.bus.on('player-resource-collision', ({ resource }) => {
      this.resources.claim(resource);
    });

    this.bus.on('player-shelf-collision', ({ shelf }) => {
      this.stock.place(shelf);
    });

    this.bus.on('customer-shelf-collision', async ({ customer, shelf }) => {
      if (!shelf.produces) return;
      if (!this.customers.isShopping(customer, shelf.produces)) return;

      const item = this.stock.take(shelf);
      if (item?.produces) {
        this.customers.acquire(customer, item.produces);
        minimapBus.emit('customer-takes-from-shelf', {
          customerId: customer.name,
          shelf,
        });
        return;
      }

      this.customers.wait(customer, shelf);
    });

    minimapBus.on('customer-takes-from-shelf', ({ customerId, shelf }) => {
      if (shelf.produces === 'register') {
        this.sound.play('cash-register', {
          volume: 0.2,
        });
        const gold = this.customers.getPlanCost(customerId);
        for (let i = 0; i < gold; i++) {
          this.produceGold(shelf);
        }
      }
    });

    this.input.keyboard?.on('keydown-ONE', () => {
      this.produceGold({ x: 256, y: 256 });
    });
  }

  produceGold(data: Point) {
    const x = Phaser.Math.Between(-64, 64) + data.x;
    const y = Phaser.Math.Between(-64, 64) + data.y;
    const resource = new GoldCoin(this.world, x, y);
    this.stock.scene.add.existing(resource);
    this.stock.resources.register(resource);

    minimapBus.emit('resource-generated', {
      name: resource.name,
      texture: resource.resourceTexture,
      worldX: resource.x,
      worldY: resource.y,
      type: 'resource',
    });
  }

  normalizeCollision(
    bodyA: Phaser.GameObjects.GameObject,
    bodyB: Phaser.GameObjects.GameObject
  ) {
    if (Customer.owns(bodyA) && Customer.owns(bodyB)) {
      return;
    }

    if (Player.owns(bodyA) && Player.owns(bodyB)) {
      return;
    }

    if (Player.owns(bodyA) && Customer.owns(bodyB)) {
      return;
    }

    if (Customer.owns(bodyA) && ResourcesSystem.owns(bodyB)) {
      return;
    }

    if (Customer.owns(bodyB) && ResourcesSystem.owns(bodyA)) {
      return;
    }

    if (Player.owns(bodyA) && ResourcesSystem.owns(bodyB)) {
      return this.bus.emit('player-resource-collision', {
        resource: bodyB,
        player: bodyA,
      });
    }

    if (Player.owns(bodyB) && ResourcesSystem.owns(bodyA)) {
      return this.bus.emit('player-resource-collision', {
        resource: bodyA,
        player: bodyB,
      });
    }

    if (Player.owns(bodyA) && StockSystem.owns(bodyB)) {
      return this.bus.emit('player-shelf-collision', {
        shelf: bodyB,
        player: bodyA,
      });
    }

    if (Player.owns(bodyB) && StockSystem.owns(bodyA)) {
      return this.bus.emit('player-shelf-collision', {
        shelf: bodyA,
        player: bodyB,
      });
    }

    if (Customer.owns(bodyA) && StockSystem.owns(bodyB)) {
      return this.bus.emit('customer-shelf-collision', {
        shelf: bodyB,
        customer: bodyA,
      });
    }

    if (Customer.owns(bodyB) && StockSystem.owns(bodyA)) {
      return this.bus.emit('customer-shelf-collision', {
        shelf: bodyA,
        customer: bodyB,
      });
    }

    console.warn('Unhandled collision', bodyA, bodyB);
  }
}
