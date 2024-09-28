import { IItem, Index, Price, UniqueId } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Item extends Component<IItem> {
  protected _button: HTMLButtonElement;
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _description: HTMLElement;
  protected _index: HTMLElement;
  protected _id: UniqueId;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this._button = this.container.querySelector('.card__button');
    this._category = this.container.querySelector('.card__category');
    this._title = this.container.querySelector('.card__title');
    this._image = this.container.querySelector('.card__image');
    this._price = this.container.querySelector('.card__price');
    this._description = this.container.querySelector('.card__text');
    this._index = this.container.querySelector('.basket__item-index');

    if (this._index) {
      this._index.textContent = '-';
    }
    
    if (this.container.classList.contains('gallery__item')) {
      this.container.addEventListener('click', () => {
        this.events.emit('item:select', { item: this });
      })
    }

    if (this._button) {
      if (this._button.classList.contains('basket__item-delete')) {
        this._button.addEventListener('click', () => {
          this.events.emit('item:delete', { item: this });
        })
      } else {
        this._button.addEventListener('click', () => {
          this.events.emit('item:add', { item: this });
        })
      }
    }
  }
  
  deleteItem() {
    this.container.remove();
    this.container = null;
  }

  protected set id(data: UniqueId) {
    this._id = data;
  }

  setValid(isValid: boolean): void {
    if (this._button) this._button.disabled = !isValid;
  }

  setButtonTitle(title?: string): void {
    if (this._button && title) this._button.textContent = title;
    if (this._button && !title) this._button.textContent = 'В корзину';
  }

  protected set index(data: Index) {
    if (this._index) this._index.textContent = data.toString();
  }

  protected set description(data: string) {
    if (this._description) this._description.textContent = data
  }

  protected set image(data: string) {
    if (!data.includes('/')) {
      data = ''.concat('/', data);
    }
    if (this._image) {
      this._image.src = `${CDN_URL}${data}`;
    }
  }

  protected set title(data: string) {
    if (this._title) this._title.textContent = data;
  }

  protected set category(data: string) {
    if (this._category) {
      this._category.textContent = data;
      this.setCategoryStyle(data);
    }
  }

  protected setCategoryStyle(data: string): void {
    this._category.className = 'card__category';
    switch (data) {
      case 'софт-скил':
        this._category.classList
          .add('card__category_soft');
        break;
      case 'другое':
        this._category.classList
          .add('card__category_other');
        break;
      case 'дополнительное':
        this._category.classList
          .add('card__category_additional');
        break;
      case 'кнопка':
        this._category.classList
          .add('card__category_button');
        break;
      case 'хард-скил':
        this._category.classList
          .add('card__category_hard');
        break;  
    }
  }

  protected set price(data: Price | null) {
    if (this._price) {
      if (data) {
        this._price.textContent = `${data.toString()} синапсов`;
      } else {
        this._price.textContent = 'Бесценный';
        this.setValid(false);
      }
    }
  }

  get id() {
    return this._id;
  }
}