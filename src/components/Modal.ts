import { IEvents } from "./base/events";

export class Modal {
  protected modal: HTMLElement;
  protected container: HTMLElement;
  protected closeButton: HTMLElement; 
  protected _content: HTMLElement;
  protected events: IEvents;

  constructor(id: string, events: IEvents) {
    this.modal = document.querySelector(id);
    this.container = this.modal.querySelector('.modal__content');
    this.closeButton = this.modal.querySelector('.modal__close');
    this.events = events;

    this.modal.addEventListener('click', (evt) => { 
      if(evt.target === this.modal || evt.target === this.closeButton) {
        this.events.emit('modal:close', { content: this._content });
      }
    });
  }

  set content(data: HTMLElement) {
    this.container.replaceChildren();
    this._content = data;
    this.container.append(data);
  }

  open(content: HTMLElement): void {
    this.content = content;
    this.modal.classList.add('modal_active');
  }

  close(): void {
    this.modal.classList.remove('modal_active');
  }
}