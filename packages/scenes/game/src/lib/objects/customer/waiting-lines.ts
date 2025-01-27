import { IShelf } from 'shared';
import { Customer } from './customer';
import { notificationBus } from 'scenes/notifications';

export class WaitingLines {
  customers: Record<string, Customer[]>;
  constructor() {
    this.customers = {};
  }

  has(shelf: IShelf) {
    return !!this.customers[shelf.name];
  }

  get(shelf: IShelf) {
    if (!this.has(shelf)) {
      this.customers[shelf.name] = [];
    }

    return this.customers[shelf.name];
  }

  set(shelf: IShelf, customers: Customer[]) {
    this.customers[shelf.name] = customers;
  }

  add(shelf: IShelf, customer: Customer) {
    const line = this.get(shelf);

    if (!line.includes(customer)) {
      line.push(customer);
      if (line.length > 1) {
        notificationBus.emit('line-is-starting', {
          length: line.length,
          shelf,
        });
      }
    }
  }

  remove(shelf: IShelf, customer: Customer) {
    const line = this.get(shelf);

    const index = line.indexOf(customer);
    if (index !== -1) {
      line.splice(index, 1);
      this.set(shelf, line);
    }
  }

  positionOf(shelf: IShelf, customer: Customer) {
    const line = this.get(shelf);

    return line.indexOf(customer);
  }
}
