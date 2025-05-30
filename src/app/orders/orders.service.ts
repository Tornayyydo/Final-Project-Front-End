import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = 'https://localhost:7074/api/'

  constructor(private http: HttpClient) { }

  getOrdersForUser(){
    return this.http.get<IOrder[]>(this.baseUrl + 'orders')
  }

  getOrderDetails(id: number){
    return this.http.get<IOrder>(this.baseUrl + 'orders/' + id)
  }
}
