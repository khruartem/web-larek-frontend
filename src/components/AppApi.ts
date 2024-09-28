import { IApi, IItem, IOrder, TOrderCreated, UniqueId } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getItems(): Promise<IItem[]> {
		return this._baseApi.get<{items: IItem[], total: number}>(`/product`).then((data: {items: IItem[], total: number}) => data.items);
	}

	getItem(id: UniqueId): Promise<IItem> {
		return this._baseApi.get<IItem>(`/product/${id}`).then((item: IItem) => item);
	}

	createOrder(data: IOrder): Promise<TOrderCreated> {
		return this._baseApi.post<TOrderCreated>(`/order`, data).then((res: TOrderCreated) => res);
	}
}
