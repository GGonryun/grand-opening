import { ResourceType, TypedEventEmitter } from 'shared';

export type ShoppingListItem = {
  key: ResourceType;
  required: number;
  acquired: number;
};

export type ShoppingPlanItem = ShoppingListItem;

export class ShoppingPlan {
  plan: ShoppingPlanItem[];
  currentIndex: number;
  bus: TypedEventEmitter<{
    update: [ShoppingPlanItem];
    'next-item': [];
    complete: [];
  }>;
  constructor(plan: ShoppingPlanItem[]) {
    this.plan = plan;
    this.bus = new TypedEventEmitter();
    this.currentIndex = 0;
  }

  load() {
    this.bus.emit('update', this.plan[this.currentIndex]);
  }

  get current(): ShoppingPlanItem | undefined {
    return this.plan[this.currentIndex];
  }

  destroy() {
    this.bus = new TypedEventEmitter();
    // no-op otherwise.
  }

  calculateCost() {
    return this.plan.reduce((total, item) => {
      return total + item.required;
    }, 0);
  }

  collect(key: ResourceType) {
    const item = this.current;
    if (!item) return;
    if (item.key !== key) return;

    item.acquired++;
    this.bus.emit('update', item);

    if (item.acquired < item.required) return;

    this.currentIndex++;
    const nextItem = this.plan[this.currentIndex];

    if (!nextItem) {
      this.bus.emit('complete');
    } else {
      this.bus.emit('next-item');
    }
  }
}
