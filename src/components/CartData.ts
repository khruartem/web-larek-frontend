import { ICartData, IItem, Price, UniqueId } from "../types";
import { IEvents } from "./base/events";

export class CartData implements ICartData {
  protected _items: Set<string>;
  protected _total: Price;
  protected _size: number;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this._items = new Set();
    this._size = this._items.size;
    this._total = 0;
  }

  addItem(item: IItem): void {
    const itemToAdd = JSON.stringify(item);

    this._items.add(itemToAdd);
    this.updateCart();
  }

  deleteItem(id: UniqueId): void {
    const itemToDelete = this.getItem(id);

    if (itemToDelete) {
      this._items.delete(JSON.stringify(itemToDelete));
      this.updateCart();
    } else {
      throw new Error(`Item ${id} is not found in cart.`);
    }
  }

  contains(id: UniqueId): boolean {
    const itemToCheck = this.getItem(id);

    return [...this._items].some(item => {
      return item === JSON.stringify(itemToCheck)
    });
  }

  clear(): void {
    this._items = new Set();
    this._size = this._items.size;
    this._total = 0;
    this.events.emit('cart:changed');
  }

  protected updateCart(): void {
    this.size = this._items.size
    this._total = this.recalculateTotal(this._items);
    this.events.emit('cart:changed');
  }
  
  protected setIndexes(items: IItem[]): IItem[] {
    let index = 0;

    items.forEach(item => {
      item.index = ++index;
    });

    return items;
  }

  protected formatItemSet(itemSet: Set<string>): IItem[] {
    return [...itemSet].map((item) => {
      return JSON.parse(item)
    });
  }

  protected getItem(id: UniqueId): IItem {
    const formattedItemSet = this.formatItemSet(this._items);
    
    return formattedItemSet.find(item => item.id === id);
  }

  protected recalculateTotal(items: Set<string>): Price {
    const formattedItemSet = this.formatItemSet(items);
    
    return formattedItemSet.reduce((total, item) => {
      return total + item.price
    }, 0)
  }

  get items(): IItem[] {
    const formattedItemSet = this.formatItemSet(this._items);
    return this.setIndexes(formattedItemSet);
  }

  set items(data: IItem[]) {
    data.forEach(item => {
      this._items.add(JSON.stringify(item))
    });

    this.updateCart();
  }

  get total(): Price {
    return this._total;
  }

  get size(): number {
    return this._size;
  }

  protected set size(size: number) {
    this._size = size;
  }
}  