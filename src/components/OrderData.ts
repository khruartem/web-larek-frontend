import { Address, Email, IOrder, IOrderData, PaymentType, Phone, Price, TOrderCreated , UniqueId } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrderData {
  protected _payment: PaymentType;
  protected _address: Address;
  protected _email: Email;
  protected _phone: Phone;
  protected _total: Price;
  protected _items: UniqueId[];
  protected _created: TOrderCreated;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  isValid(): boolean {
    if (
      this.payment &&
      this.address &&
      this.email &&
      this.phone &&
      this.items &&
      this.total
    ) return true
    else return false
  }
  
  clear(): void {
    this._total = null;
    this._items = null;
    this._payment = null;
    this._address = null;
    this._email = null;
    this._phone = null;
    this.events.emit('order:changed');
  }

  get order(): IOrder {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
      total: this._total,
      items: this._items,
    }
  }

  get payment() {
    return this._payment
  }

  set payment(data: PaymentType) {
    this._payment = data;
    this.events.emit('order:changed');
  }

  get address() {
    return this._address
  }

  set address(data: Address) {
    this._address = data;
    this.events.emit('order:changed');
  }

  get email() {
    return this._email
  }

  set email(data: Email) {
    this._email = data;
    this.events.emit('order:changed');
  }

  get phone() {
    return this._phone
  }

  set phone(data: Phone) {
    this._phone = data;
    this.events.emit('order:changed');
  }

  get total() {
    return this._total
  }

  set total(data: Price) {
    this._total = data;
    this.events.emit('order:changed');
  }

  get items() {
    return this._items
  }

  set items(data: UniqueId[]) {
    this._items = data;
    this.events.emit('order:changed');
  }

  get created(): TOrderCreated {
    return this._created;
  }

  set created(data: TOrderCreated) {
    if (data.id) this._created = data;
    else throw new Error('Error while creating the order: id is missing'); 
  }
}