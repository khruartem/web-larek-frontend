

export interface IItem {
  id: UniqueId;
  index?: Index;
  description: string;
  image: string;
  title: string;
  category: string;
  price: Price;
}

export interface IOrder {
  payment: PaymentType;
  email: Email;
  phone: Phone;
  address: Address;
  total: Price;
  items: UniqueId[];
}

export interface IItemsData {
  items: IItem[];
  preview: string | null;
  getItem(id: string): IItem;
}

export interface ICartData {
  items: IItem[];
  total: Price;
  size: number;
  addItem(data: IItem): void;
  deleteItem(id: string): void;
}

export interface IOrderData {
  cart: ICartData;
  payment: PaymentType | null;
  email: Email | null;
  phone: Phone | null;
  address: Address | null;
  getOrderInfo(): IOrder;
  setOrderInfo(data: TOrderContactInfo | TOrderPaymentInfo): void;
}

export type UniqueId = string;
export type PaymentType = 'online' | 'upon_receipt';
export type Email = string;
export type Phone = string;
export type Address = string;
export type Price = number;
export type Index = number | null;
export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;