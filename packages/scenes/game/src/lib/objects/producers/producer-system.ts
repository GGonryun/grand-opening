import { Inventory } from '../player/inventory';
import { ResourceType } from '../resources/resources-system';

export type IProducer = {
  get produces(): ResourceType;
  get consumes(): ResourceType[];
  get consumptionQuantity(): number;
  get consumptionCapacity(): number;
  get productionSpeed(): number;
  get productionQuantity(): number;
  get productionCapacity(): number;
};

export class ProducerSystem {
  scene: Phaser.Scene;
  inventory: Inventory;
  producers: Record<string, IProducer>;
  constructor(scene: Phaser.Scene, inventory: Inventory) {
    this.scene = scene;
    this.inventory = inventory;
    this.producers = {};
  }
}
