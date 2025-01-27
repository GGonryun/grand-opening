import { CustomersSystem } from './customers-system';

export class CustomerSpawner {
  customers: CustomersSystem;
  count: number;
  max: number;
  spawnTimer: {
    min: number;
    max: number;
  };
  constructor(customers: CustomersSystem) {
    this.customers = customers;
    this.count = 0;
    this.max = 7;
    this.spawnTimer = {
      min: 1000,
      max: 10000,
    };

    this.spawn();
  }
  spawn() {
    this.customers.scene.time.delayedCall(
      Phaser.Math.RND.between(this.spawnTimer.min, this.spawnTimer.max),
      () => {
        this.spawn();
        if (this.count >= this.max) {
          return;
        }
        this.customers.create();
        this.count++;
      }
    );
  }

  reclaim() {
    this.count--;
  }
}
