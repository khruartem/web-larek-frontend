import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface ICart {
  catalog: HTMLElement[];
  total: string;
  size: string;
}

export class Cart extends Component<ICart> {
  protected _catalog: HTMLElement;
  protected _total: HTMLElement;
  protected checkOutButton: HTMLButtonElement;
  protected cartIcon: HTMLButtonElement;
  protected _size: HTMLSpanElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._catalog = container.querySelector('.basket__list');
    this._total = container.querySelector('.basket__price');
    this.checkOutButton = container.querySelector('.basket__button');
    this.cartIcon = document.querySelector('.header__basket');
    this._size = document.querySelector('.header__basket-counter');

    this.checkOutButton.addEventListener('click', () => {
      events.emit('cart:checkout');
    });

    this.cartIcon.addEventListener('click', () => {
      events.emit('cart:open');
    });
  }

  setValid(isValid: boolean, type: 'icon' | 'button'): void {
    if (type === 'icon') this.cartIcon.disabled = !isValid;
    if (type === 'button') this.checkOutButton.disabled = !isValid;
  }

  setButtonTitle(title: string): void {
    this.checkOutButton.textContent = title;
  }

  set catalog(data: HTMLElement[]) {
    this._catalog.replaceChildren(...data);
  }

  set total(data: string) {
    this._total.textContent = `${data} синапсов`;
  }

  set size(data: string) {
    this._size.textContent = data;
  }
}