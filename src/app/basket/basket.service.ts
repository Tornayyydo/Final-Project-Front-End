import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/products';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null as unknown as IBasket)
  basket$ = this.basketSource.asObservable()
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null as unknown as IBasketTotals)
  basketTotal$ = this.basketTotalSource.asObservable()
  shipping = 0

  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    return this.http.post<IBasket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket)
          console.log(this.getCurrentBasketValue())
        })
      )
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price
    const basket = this.getCurrentBasketValue()
    basket.deliveryMethodId = deliveryMethod.id
    basket.shippingPrice = deliveryMethod.price
    this.calculateTotals()
    this.setBasket(basket)
  }

  getBasket(id: string){
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket)
          this.shipping = basket.shippingPrice ?? 0

          this.calculateTotals()
        })
      )
  }

  setBasket(basket: IBasket){
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe((response : IBasket) => {
      this.basketSource.next(response)
      this.calculateTotals()
    }, error => {
      console.log(error);
    })
  }

  getCurrentBasketValue(){
    return this.basketSource.value
  }

  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity)
    const basket = this.getCurrentBasketValue() ?? this.createBasket()
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity)
    this.setBasket(basket)
  }
  
  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue()
    const foundItemIndex = basket.items.findIndex(i => i.id === item.id)
    basket.items[foundItemIndex].quantity++
    this.setBasket(basket)
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue()
    const foundItemIndex = basket.items.findIndex(i => i.id === item.id)
    if (basket.items[foundItemIndex].quantity > 1){
      basket.items[foundItemIndex].quantity--
      this.setBasket(basket)
    } else {
      this.removeItemFromBasket(item)
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue()
    if(basket.items.some(i => i.id === item.id)){
      basket.items = basket.items.filter(i => i.id !== item.id)
      if(basket.items.length > 0){
        this.setBasket(basket)
      } else {
        this.deleteBasket(basket)
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null as unknown as IBasket)
      this.basketTotalSource.next(null as unknown as IBasketTotals)
      localStorage.removeItem('basket_id')
    }, error => {
      console.log(error);
    })
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue()
    const shipping = this.shipping
    const subtotal = basket.items.reduce((a,b) => (b.price * b.quantity) + a, 0)
    const total = subtotal + shipping
    this.basketTotalSource.next({shipping, total, subtotal})
  }

  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id)

    if(index == -1){
      itemToAdd.quantity = quantity
      items.push(itemToAdd)
    } else {
      items[index].quantity += quantity
    }

    return items
  }

  private createBasket(): IBasket {
    const basket = new Basket()
    localStorage.setItem('basket_id', basket.id)
    
    return basket
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }
}
