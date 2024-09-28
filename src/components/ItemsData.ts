import { IItem, IItemsData, UniqueId } from "../types";
import { IEvents } from "./base/events";

export class ItemsData implements IItemsData {
  protected _items: IItem[];
  protected _preview: UniqueId | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this._preview = null;
  }
  
  getItem(id: UniqueId): IItem | null {
    const foundItem = this._items.find(item => item.id === id);
    return foundItem ? foundItem : null
  }

  get items() {
    return this._items;
  }

  set items(data: IItem[]) {
    this._items = data;
  }

  get preview() {
    return this._preview;
  }

  set preview(id: UniqueId | null) {
    if (!id) {
      this._preview = null;
      return;
    }
    const selectedItem = this.getItem(id);
    if (selectedItem) {
      this._preview = id;
      this.events.emit('item:selected');
    }
  }

}