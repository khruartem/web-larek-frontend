import { Component } from "./base/Component";

interface IItemsCatalog {
  catalog: HTMLElement[];
}

export class ItemsCatalog extends Component<IItemsCatalog> {
  protected _catalog: HTMLElement[];

  constructor(container: HTMLElement, protected element?: HTMLElement) {
    super(container);
  }

  set catalog(data: HTMLElement[]) {
    this.container.replaceChildren(...data);
  }
}