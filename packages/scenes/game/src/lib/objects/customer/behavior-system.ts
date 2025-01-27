import {
  assertNever,
  GAME_WIDTH,
  ICON_SIZE,
  IShelf,
  ResourceType,
} from 'shared';

import { Customer } from './customer';
import { CustomersSystem } from './customers-system';
import { ShoppingPlan } from './shopping-plan';
import { approachTarget } from '../../util/movement';
import { Wishlist } from './wishlist';

export type BehaviorType =
  | 'idle'
  | 'planning'
  | 'move-to'
  | 'shopping'
  | 'exit'
  | 'terminate';

export type IBehavior = {
  id: BehaviorType;
  onEnter?(): void;
  onExit?(): void;
  update?(time: number, delta: number): IBehavior | undefined;
};

export class BehaviorSystem {
  scene: Phaser.Scene;
  customers: CustomersSystem;
  customer: Customer;

  current: IBehavior;

  constructor(
    scene: Phaser.Scene,
    customers: CustomersSystem,
    customer: Customer
  ) {
    this.scene = scene;
    this.customers = customers;
    this.customer = customer;
    this.current = new IdleBehavior(this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta: number) {
    if (this.current) {
      const next = this.current.update?.(time, delta);
      if (next) {
        this.current.onExit?.();
        this.current = next;
        this.current.onEnter?.();
      }
    }
  }

  destroy() {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  changeBehavior(type: BehaviorType) {
    this.current.onExit?.();
    this.current = this.createBehavior(type);
    this.current.onEnter?.();
  }

  createBehavior(type: BehaviorType): IBehavior {
    switch (type) {
      case 'idle':
        return new IdleBehavior(this);
      case 'planning':
        return new PlanningBehavior(this);
      case 'move-to':
        return new MoveTowardsBehavior(this);
      case 'shopping':
        return new ShoppingBehavior(this);
      case 'exit':
        return new ExitBehavior(this);
      case 'terminate':
        return new TerminateBehavior(this);
      default:
        throw assertNever(type);
    }
  }

  getPlan() {
    return this.customers.plans[this.customer.name];
  }

  getShelf(key: ResourceType) {
    return this.customers.stock.get(key);
  }

  getWishlist() {
    return this.customers.wishlist[this.customer.name];
  }
}

class IdleBehavior implements IBehavior {
  system: BehaviorSystem;
  threshold: number;
  elapsed: number;

  constructor(system: BehaviorSystem) {
    this.system = system;
    this.elapsed = 0;
    this.threshold = Phaser.Math.RND.between(1000, 1500);
  }

  get id(): BehaviorType {
    return 'idle';
  }

  update(_time: number, delta: number) {
    this.elapsed += delta;
    if (this.elapsed > this.threshold) {
      return this.system.createBehavior('planning');
    }
    return undefined;
  }
}

// for planning the customer needs to go find the first item on their wishlist.
class PlanningBehavior implements IBehavior {
  system: BehaviorSystem;
  constructor(system: BehaviorSystem) {
    this.system = system;
  }

  get id(): BehaviorType {
    return 'planning';
  }

  onEnter() {
    const plan = this.system.getPlan();
    plan.load();
  }

  update() {
    return this.system.createBehavior('move-to');
  }
}

class MoveTowardsBehavior implements IBehavior {
  system: BehaviorSystem;
  stock: IShelf;

  constructor(system: BehaviorSystem) {
    this.system = system;
    const plan = system.getPlan();
    const key = plan.current?.key;
    if (!key) {
      throw new Error('No actions left in plan');
    }
    const stock = system.getShelf(key);
    if (!stock) {
      throw new Error(`No stock found for requested resource ${stock}`);
    }
    this.stock = stock;
  }

  get id(): BehaviorType {
    return 'move-to';
  }

  update() {
    if (
      approachTarget({
        object: this.system.customer,
        target: this.stock,
        speed: this.system.customer.speed,
        threshold: this.stock.distanceThreshold,
      })
    ) {
      return this.system.createBehavior('shopping');
    } else {
      return undefined;
    }
  }
}

// used for waiting for a stock to become available.
// the only way out of this behavior is if the stock state changes and all resources are acquired.
class ShoppingBehavior implements IBehavior {
  system: BehaviorSystem;
  plan: ShoppingPlan;
  shelf: IShelf;
  constructor(system: BehaviorSystem) {
    this.system = system;
    this.plan = system.getPlan();
    const key = this.plan.current?.key;
    if (!key) {
      throw new Error('No actions left in plan');
    }
    const shelf = system.getShelf(key);
    if (!shelf) {
      throw new Error(`No shelf found for requested resource ${key}`);
    }
    this.shelf = shelf;
  }

  get id(): BehaviorType {
    return 'shopping';
  }

  update() {
    const position = this.system.customers.lines.positionOf(
      this.shelf,
      this.system.customer
    );
    if (position === -1) {
      this.system.customers.wait(this.system.customer, this.shelf);
    }
    const targetPosition = new Phaser.Math.Vector2(
      -8 + this.shelf.x + ((position + 1) * ICON_SIZE) / 2,
      this.shelf.y
    );

    approachTarget({
      object: this.system.customer,
      target: targetPosition,
      speed: this.system.customer.speed,
      threshold: 4,
    });

    return undefined;
  }
}

class ExitBehavior implements IBehavior {
  system: BehaviorSystem;
  wishlist: Wishlist;
  constructor(system: BehaviorSystem) {
    this.system = system;
    this.wishlist = system.getWishlist();
  }

  get id(): BehaviorType {
    return 'exit';
  }

  onEnter() {
    this.wishlist.hide();
  }

  update() {
    if (
      approachTarget({
        object: this.system.customer,
        target: new Phaser.Math.Vector2(GAME_WIDTH / 2, -512),
        speed: this.system.customer.speed,
        threshold: 4,
      })
    ) {
      return this.system.createBehavior('terminate');
    }
    return undefined;
  }
}

class TerminateBehavior implements IBehavior {
  system: BehaviorSystem;
  constructor(system: BehaviorSystem) {
    this.system = system;
  }
  id: BehaviorType;

  onEnter(): void {
    this.system.customers.reclaim(this.system.customer);
  }
}
