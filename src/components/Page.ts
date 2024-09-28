export class Page {
  protected container: HTMLElement;

  constructor(selector: string) {
    this.container = document.querySelector(selector);
  }

  lock(): void {
    this.container.classList.add('page__wrapper_locked');
  }

  unlock(): void {
    this.container.classList.remove('page__wrapper_locked');
  }
}