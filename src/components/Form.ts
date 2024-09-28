import { PaymentType, TOrderInfo } from "../types";
import { getElementData, setElementData } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IForm {
  inputValues: Partial<TOrderInfo>;
  setValid(isValid: boolean): void;
}

export class Form extends Component<IForm> {
  protected formName: string;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected submitButton: HTMLButtonElement;
  protected inputs: NodeListOf<HTMLInputElement>;
  protected error: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.formName = (this.container as HTMLFormElement).name;
    this.cardButton = container.querySelector('button[name="card"]');
    this.cashButton = container.querySelector('button[name="cash"]');
    this.submitButton = container.querySelector('button[type="submit"]');
    this.inputs = container.querySelectorAll('.form__input');
    this.error = container.querySelector('.form__errors');

    setElementData<{error: string}>(this.error, {error: 'Заполните все поля'});
    
    if (this.cardButton && this.cashButton) {
      this.cardButton.addEventListener('click', () => {
        this.select(this.cardButton);
        this.unselect(this.cashButton);
        this.events.emit(`${this.formName}:input`, { ...this.getInputValues() });
      });
      this.cashButton.addEventListener('click', () => {
        this.select(this.cashButton);
        this.unselect(this.cardButton);
        this.events.emit(`${this.formName}:input`, { ...this.getInputValues() });
      });
    }

    this.container.addEventListener('input', () => {
      this.events.emit(`${this.formName}:input`, { ...this.getInputValues() });
    });

    this.container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(`${this.formName}:submit`, this.getInputValues());
    });
  }

  setValid(isValid: boolean): void {
    this.submitButton.disabled = !isValid;
  }

  showErrors(message?: string): void {
    if (message) {
      this.error.classList.add('modal__message_error');
      this.error.textContent = message;
    } else {
      this.error.classList.add('modal__message_error');
      this.error.textContent = getElementData<{error: string}>(this.error, {error: (a: string) => a}).error;
    }
  }

  hideErrors(): void {
    this.error.classList.remove('modal__message_error');
    this.error.textContent = '';
  }

  protected select(button: HTMLButtonElement): void {
    button.classList.toggle('button_alt-active');
  }

  protected unselect(button: HTMLButtonElement): void {
    button.classList.remove('button_alt-active');
  }

  protected isSelected(button: HTMLButtonElement): boolean {
    return (button.classList.contains('button_alt-active'))
      ? true
      : false
  }

  protected set payment(data: PaymentType) {
    switch (data) {
      case 'card':
        if (!this.isSelected(this.cardButton)) {
          this.select(this.cardButton);
        }
        if (this.isSelected(this.cashButton)) {
          this.unselect(this.cashButton);
        }
        break;
      case 'cash':
        if (!this.isSelected(this.cashButton)) {
          this.select(this.cashButton);
        }
        if (this.isSelected(this.cardButton)) {
          this.unselect(this.cardButton);
        }
        break;
      default:
        this.unselect(this.cardButton);
        this.unselect(this.cashButton);
    }
  }

  protected getInputValues(): Record<string, string> {
    const inputValues: Record<string, string> = {};
    
    if (this.cardButton && this.cashButton) {
      if (this.isSelected(this.cardButton)) {
        Object.assign(inputValues, {
          payment: this.cardButton.name
        })
      } else if (this.isSelected(this.cashButton)) {
        Object.assign(inputValues, {
          payment: this.cashButton.name
        })
      } else {
        Object.assign(inputValues, {
          payment: null
        })
      }
    }
    
    this.inputs.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }
  
  set inputValues(data: Partial<TOrderInfo>) {
    const { payment, ...otherData } = data;
    if (payment && (this.cardButton || this.cashButton)) {
      this.payment = payment as PaymentType;
    }
    if (otherData) this.inputs.forEach((input) => {
      input.value = (otherData as Record<string, string>)[input.name];
    });
    this.events.emit(`${this.formName}:input`, { ...this.getInputValues() });
  }

  clear(): void {
    (this.container as HTMLFormElement).reset();
    if (this.isSelected(this.cardButton)) this.unselect(this.cardButton);
    if (this.isSelected(this.cashButton)) this.unselect(this.cashButton);
  }
}