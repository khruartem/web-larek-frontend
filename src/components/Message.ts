import { TOrderCreated } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IMessage {
  description: string;
}

export class Message extends Component<IMessage> {
  protected _description: HTMLElement;
  protected closeButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this._description = container.querySelector('.order-success__description');
    this.closeButton = container.querySelector('.button');

    this.closeButton.addEventListener('click', () => {
      events.emit('all:reset');
    })
  }

  set description(data: string) {
    this._description.textContent = data;
  }
}