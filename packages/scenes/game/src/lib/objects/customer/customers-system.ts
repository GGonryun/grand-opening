import { Customer } from './customer';
import { ShoppingCart } from './shopping-cart';

import { StockSystem } from '../stock/stock-system';
import { BehaviorSystem } from './behavior-system';
import { ElementDepths, GAME_WIDTH, IShelf, ResourceType } from 'shared';
import { ShoppingListItem, ShoppingPlan } from './shopping-plan';
import { Wishlist } from './wishlist';
import { CustomerSpawner } from './customer-spawner';
import { WaitingLines } from './waiting-lines';

export class CustomersSystem {
  scene: Phaser.Scene;
  stock: StockSystem;
  layer: Phaser.GameObjects.Layer;
  customers: Record<string, Customer>;
  behaviors: Record<string, BehaviorSystem>;
  plans: Record<string, ShoppingPlan>;
  wishlist: Record<string, Wishlist>;
  carts: Record<string, ShoppingCart>;
  lines: WaitingLines;
  spawner: CustomerSpawner;

  constructor(scene: Phaser.Scene, stock: StockSystem) {
    this.scene = scene;

    this.stock = stock;

    this.layer = this.scene.add.layer().setDepth(ElementDepths.Customers);

    this.customers = {};
    this.wishlist = {};
    this.carts = {};
    this.plans = {};
    this.behaviors = {};
    this.lines = new WaitingLines();
    this.spawner = new CustomerSpawner(this);
  }

  generatePlan() {
    const items: ShoppingListItem[] = [];
    items.push({ key: 'door', required: 1, acquired: 0 });
    // random chance of spawning either strawberry or milk guy
    const more: ShoppingListItem[] = Phaser.Math.RND.weightedPick([
      [{ key: 'strawberry', required: 1, acquired: 0 }],
      [{ key: 'strawberry', required: 2, acquired: 0 }],
      [{ key: 'cold-milk', required: 1, acquired: 0 }],
      [{ key: 'strawberry', required: 3, acquired: 0 }],
      [
        { key: 'strawberry', required: 1, acquired: 0 },
        { key: 'cold-milk', required: 1, acquired: 0 },
      ],
      [{ key: 'bubble-tea', required: 1, acquired: 0 }],
      [{ key: 'cold-milk', required: 2, acquired: 0 }],
      [
        { key: 'cold-milk', required: 1, acquired: 0 },
        { key: 'bubble-tea', required: 1, acquired: 0 },
      ],
      [
        { key: 'strawberry', required: 1, acquired: 0 },
        { key: 'cold-milk', required: 1, acquired: 0 },
        { key: 'bubble-tea', required: 1, acquired: 0 },
      ],
      [
        { key: 'strawberry', required: 3, acquired: 0 },
        { key: 'cold-milk', required: 2, acquired: 0 },
        { key: 'bubble-tea', required: 1, acquired: 0 },
      ],
    ]);
    items.push(...more);
    items.push({ key: 'register', required: 1, acquired: 0 });
    items.push({ key: 'door', required: 1, acquired: 0 });

    return new ShoppingPlan(items);
  }

  getPlanCost(customerId: string) {
    const plan = this.plans[customerId];
    if (!plan) {
      throw new Error('No plan found for customer');
    }
    return plan.calculateCost();
  }

  create() {
    const customer = new Customer(this.scene);
    customer.setPosition(GAME_WIDTH / 2, -400);
    this.layer.add(customer);

    this.customers[customer.name] = customer;
    const behaviors = new BehaviorSystem(this.scene, this, customer);
    this.behaviors[customer.name] = behaviors;

    const wishlist = new Wishlist(this.scene, { parent: customer });
    this.layer.add(wishlist);
    this.wishlist[customer.name] = wishlist;

    const plan = this.generatePlan();
    this.plans[customer.name] = plan;

    plan.bus.on('update', (item) => {
      wishlist.show(item);
    });

    plan.bus.on('next-item', () => {
      behaviors.changeBehavior('planning');
    });

    plan.bus.on('complete', () => {
      behaviors.changeBehavior('exit');
    });
  }

  wait(customer: Customer, shelf: IShelf) {
    this.lines.add(shelf, customer);
  }

  acquire(customer: Customer, key: ResourceType) {
    const plan = this.plans[customer.name];
    plan.collect(key);

    const shelf = this.stock.get(key);

    this.lines.remove(shelf, customer);
  }

  isShopping(customer: Customer, type: ResourceType) {
    const plan = this.plans[customer.name];
    const behavior = this.behaviors[customer.name];
    return behavior.current.id === 'shopping' && plan.current?.key === type;
  }

  reclaim(customer: Customer) {
    const wishlist = this.wishlist[customer.name];
    if (wishlist) {
      wishlist.destroy();
      delete this.wishlist[customer.name];
    }

    const cart = this.carts[customer.name];
    if (cart) {
      cart.destroy();
      delete this.carts[customer.name];
    }

    const plan = this.plans[customer.name];
    if (plan) {
      plan.destroy();
      delete this.plans[customer.name];
    }

    const behavior = this.behaviors[customer.name];
    if (behavior) {
      behavior.destroy();
      delete this.behaviors[customer.name];
    }

    customer.hide();
    this.scene.time.delayedCall(100, () => {
      customer.destroy();
      delete this.customers[customer.name];
      this.spawner.reclaim();
    });
  }
}
