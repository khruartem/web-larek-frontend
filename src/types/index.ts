import { ApiPostMethods } from "../components/base/api";


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
  id?: UniqueId;
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
  deleteItem(id: UniqueId): void;
  contains(id: UniqueId): boolean;
}

export interface IOrderData {
  order: IOrder;
  payment: PaymentType;
  email: Email;
  phone: Phone;
  address: Address;
  total: Price;
  created: TOrderCreated;
}

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type UniqueId = string;
export type PaymentType = 'card' | 'cash';
export type Email = string;
export type Phone = string;
export type Address = string;
export type Price = number;
export type Index = number | null;
export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
export type TOrderInfo = Pick<IOrder, 'address' | 'email' | 'payment' | 'phone'>;
export type TOrderCreated = Pick<IOrder, 'id' | 'total'>;