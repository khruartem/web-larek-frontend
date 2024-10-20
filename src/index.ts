import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ItemsData } from './components/ItemsData';
import { EventEmitter, eventTypes, IEvents } from './components/base/events';
import { CartData } from './components/CartData';
import { IApi, IItem, TOrderContactInfo, TOrderCreated, TOrderPaymentInfo } from './types';
import { OrderData } from './components/OrderData';
import { Item } from './components/Item';
import { cloneTemplate } from './utils/utils';
import { ItemsCatalog } from './components/ItemsCatalog';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { Cart } from './components/Cart';
import { Form } from './components/Form';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { Message } from './components/Message';

// Инстансы классов
const baseApi: IApi = new Api(API_URL);
const appApi = new AppApi(baseApi);
const events: IEvents = new EventEmitter();
const itemsData = new ItemsData(events);
const cartData = new CartData(events);
const orderData = new OrderData(events);
const itemsCatalog = new ItemsCatalog(document.querySelector('.gallery'));
const cart = new Cart(
  cloneTemplate(document.querySelector('#basket') as HTMLTemplateElement),
  events
);
const modal = new Modal('#modal-container', events);
const page = new Page('.page__wrapper');
const formOrder = new Form(
  cloneTemplate(document.querySelector('#order') as HTMLTemplateElement),
  events
);
const formContacts = new Form(
  cloneTemplate(document.querySelector('#contacts') as HTMLTemplateElement),
  events
);
const messageSuccess = new Message(
  cloneTemplate(document.querySelector('#success') as HTMLTemplateElement),
  events
);

// Темплейты
const templateItemGallery: HTMLTemplateElement = document.querySelector('#card-catalog');
const templateItemPreview: HTMLTemplateElement = document.querySelector('#card-preview');
const templateItemCart: HTMLTemplateElement = document.querySelector('#card-basket');

// Контейнеры для списока товаров и корзины
const gallery: HTMLElement[] = [];
const cartList: HTMLElement[] = [];

// Получение товаров с сервера
appApi.getItems()
  .then(data => events.emit('items:loaded', { data }))
  .catch(err => console.log(err));

// Слушатель события загрузки товаров с сервера
events.on(eventTypes.VIEW_ITEMS_LOADED, (evt: { data: IItem[] }) => {
  itemsData.items = evt.data;
  fillCatalog(itemsData, gallery, templateItemGallery);
  itemsCatalog.render({ catalog: gallery });
  if (!cartData.size) cart.setValid(false, 'icon');
});

// Слушатель события выбора товара
events.on(eventTypes.VIEW_ITEM_SELECT, (evt: { item: Item }) => {
  if (!cartData.contains(evt.item.id)) {
    evt.item.setValid(true);
    evt.item.setButtonTitle();
  } else {
    evt.item.setValid(false);
    evt.item.setButtonTitle('Уже в корзине');
  }

  itemsData.preview = evt.item.id;
  const itemPreviewElement = renderItemPreview();
  modal.open(itemPreviewElement);
  page.lock();
});

// Слушатель события открытия корзины
events.on(eventTypes.VIEW_CART_OPEN, () => {
  modal.open(cart.render({
    catalog: cartList,
    total: cartData.total.toString(),
    size: cartData.size.toString()
  }));
  page.lock();
});

// Слушатель закрытия модального окна
events.on(eventTypes.VIEW_MODAL_CLOSE, ({ content }: { content: HTMLElement }) => {
  if (cartData.size) cart.setValid(true, 'icon');
  else cart.setValid(false, 'icon');
  modal.close();
  page.unlock();
  if (itemsData.preview && content.classList.contains('card_full')) {
    const itemToFocus: HTMLElement = document.getElementById(`${itemsData.preview}`);
    console.log(itemToFocus);
    itemToFocus.focus();
  }
})

// Слушатель добавления товара в корзину
events.on(eventTypes.VIEW_ITEM_ADD, (evt: { item: Item }) => {
  evt.item.setValid(false);
  evt.item.setButtonTitle('Уже в корзине');

  cartData.addItem(itemsData.getItem(evt.item.id));
  cart.setValid(true, 'button');

  const itemInstance = new Item(cloneTemplate(templateItemCart), events);
  const itemAdded = cartData.items.find(item => item.id === evt.item.id);

  cartList.push(itemInstance.render(itemAdded));
  cart.size = cartData.size.toString();
})

// Слушатель удаления товара из корзины
events.on(eventTypes.VIEW_ITEM_DELETE, (evt: { item: Item }) => {
  evt.item.setValid(true);
  evt.item.setButtonTitle();
  cartData.deleteItem(evt.item.id);
  if (!cartData.size) cart.setValid(false, 'button');
  cartList.splice(0, cartList.length);
  fillCatalog(cartData, cartList, templateItemCart)
  cart.render({
    catalog: cartList,
    total: cartData.total.toString(),
    size: cartData.size.toString()
  });
})

// Слушатель перехода к вводу платежной информации заказа
events.on(eventTypes.VIEW_CART_CHECKOUT, () => {
  orderData.items = cartData.items.map(item => { return item.id });
  orderData.total = cartData.total;

  if (orderData.address && orderData.payment) {
    formOrder.inputValues = {
      payment: orderData.payment,
      address: orderData.address
    };
  } else {
    formOrder.clear();
    formOrder.setValid(false);
    formOrder.showErrors();
  }

  modal.content = formOrder.render();
})

// Слушатель на инпут на форме ввода данных об оплате
events.on(eventTypes.VIEW_ORDER_INPUT, (evt: TOrderPaymentInfo) => {
  handlerInput(evt, formOrder);
})

// Слушатель сабмита формы ввода данных об оплате
events.on(eventTypes.VIEW_ORDER_SUBMIT, (evt: TOrderPaymentInfo) => {
  orderData.address = evt.address;
  orderData.payment = evt.payment;

  if (orderData.email && orderData.phone) {
    formContacts.inputValues = {
      email: orderData.email,
      phone: orderData.phone
    };
  } else {
    formContacts.setValid(false);
    formContacts.showErrors();
  }

  modal.content = formContacts.render();
})

// Слушатель на инпут на форме ввода контактной информации
events.on(eventTypes.VIEW_CONTACTS_INPUT, (evt: TOrderContactInfo) => {
  handlerInput(evt, formContacts);
});

// Слушатель сабмита формы ввода данных об оплате
events.on(eventTypes.VIEW_CONTACTS_SUBMIT, (evt: TOrderContactInfo) => {
  orderData.email = evt.email;
  orderData.phone = evt.phone;
  if (!orderData.isValid()) throw new Error('Order data is invalid');
  appApi.createOrder(orderData.order)
    .then(createdOrder => events.emit(('order:created'), { createdOrder }))
    .catch(err => formContacts.showErrors(`Ошибка при создании заказа: ${err}`));
})

// Слушатель успешного создания заказа
events.on(eventTypes.VIEW_ORDER_CREATED, (evt: { createdOrder: TOrderCreated }) => {
  modal.open(messageSuccess.render({ description: `Списано ${evt.createdOrder.total} синапсов` }));
  orderData.created = evt.createdOrder;
})

// Слушатель сброса для создания нового заказа
events.on(eventTypes.VIEW_ALL_RESET, () => {
  cartData.clear();
  orderData.clear();
  cart.size = cartData.size.toString();
  cart.setValid(false, 'icon');
  cartList.splice(0, cartList.length);
  cart.catalog = cartList;
  modal.close();
  page.unlock();
})

// Наполнить каталог элементами
function fillCatalog(dataInstance: ItemsData | CartData, catalog: HTMLElement[], template: HTMLTemplateElement) {
  dataInstance.items.forEach(item => {
    const itemInstance = new Item(cloneTemplate(template), events);
    catalog.push(itemInstance.render(item));
  });
}

// Отрисовка превью товара
function renderItemPreview(): HTMLElement {
  const itemInsance = new Item(cloneTemplate(templateItemPreview), events);
  if (cartData.contains(itemsData.preview)) {
    itemInsance.setValid(false);
    itemInsance.setButtonTitle('Уже в корзине');
  }
  return itemInsance.render(itemsData.getItem(itemsData.preview));
}

// Обработчик инпута формы
function handlerInput(evt: TOrderContactInfo | TOrderPaymentInfo, form: Form) {
  if (
    (evt as TOrderContactInfo).email && (evt as TOrderContactInfo).phone ||
    (evt as TOrderPaymentInfo).address && (evt as TOrderPaymentInfo).payment) {
    form.setValid(true);
    form.hideErrors();
  } else {
    form.setValid(false);
    form.showErrors();
  }
}