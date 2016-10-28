import {Injectable} from '@angular/core';
import {OrderItem} from "../constants/OrderItem";
import {Keys} from '../constants/Keys';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserCartService {

  constructor (private storage: Storage) {

  }

  /**
   *
   * @param productId
   * @param sellCount
   * @returns {number}
     */
  public addOrderItemByNum(productId, sellCount){

    var items:Array<OrderItem>;
    this.storage.get(Keys.USER_CART_KEY).then(res =>{
      items = res;
    });
    if(items){
      var result = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId === productId) {
          items[i].qty = sellCount;
          result = 1;
        }
      }
      if(result == 1){
        this.storage.set(Keys.USER_CART_KEY,items);
      }
     return result;
    }
  }

  /**
   *
   * @param productId
   * @returns {number}
     */
  public removeItem(productId){
    var items:Array<OrderItem>;
      this.storage.get(Keys.USER_CART_KEY).then(res =>{
        items = res;
     });
    if(items){
      var result = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId == productId) {
          if(i==0){
            let removeItem = items.shift();
            this.storage.set(Keys.USER_CART_KEY,removeItem);
            return i;
          }else{
            let newItems = items.splice(0, i);
            let newCItem2 = items.splice(i+1);
            newItems.concat(newCItem2);
            this.storage.set(Keys.USER_CART_KEY,newItems);
            return i;
          }

        }
      }
      return result;
    }
  }

  public saveItems(items){
    this.storage.set(Keys.USER_CART_KEY,items);
  }
  /**
   *
   * @param orderItem
   * @returns {number}
     */
  public addOrderItem(orderItem:OrderItem){
    var items:Array<OrderItem> = [];
    console.log(orderItem);
    this.storage.get(Keys.USER_CART_KEY).then(res =>{

      console.log(res);

      //items = res;


      if(res == null || res.length == 0){
        console.log('start storage');
        items.push(orderItem);
        this.storage.set(Keys.USER_CART_KEY,items);
        return 100;
      }else {
        console.log('start check');
        items = res;
        var result = -1;
        for (var i = 0; i < items.length; i++) {
          if (items[i].productId == orderItem.productId) {
            result = i;
            console.log('start return');
            return result;
          }
        }
        console.log('start add item');
        items.push(orderItem);
        this.storage.set(Keys.USER_CART_KEY, items);
        console.log('start added');
        return 100;
      }
    });

  }

  /**
   *
   * @param orderItem
   * @returns {number}
     */
  public quantityPlus(orderItem:OrderItem){

    var items:Array<OrderItem> = [];
    this.storage.get(Keys.USER_CART_KEY).then(res =>{
      items = res;
    });
    if(items){
      var result = -1;
      console.log('start 1');
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId == orderItem.productId) {
          items[i].qty = items[i].qty + 1;
          console.log('add 1');
          this.storage.set(Keys.USER_CART_KEY,items);
          return result;
        }
      }

      return  -1;

    }else{
     return -1;
    }
  }

  /**
   *
   * @param orderItem
   * @returns {number}
     */
  public quantityMinus(orderItem:OrderItem){

    var items:Array<OrderItem>;
    this.storage.get(Keys.USER_CART_KEY).then(res =>{
      items = JSON.parse(res);
    });
    if(items){
      var result = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId === orderItem.productId) {
          items[i].qty = items[i].qty - 1;
          this.storage.set(Keys.USER_CART_KEY,items);
          return result;
        }
      }

    }

  }


  public getGrandTotal(){
    var amount = 0;
    var items:Array<OrderItem>;
    this.storage.get(Keys.USER_CART_KEY).then(res =>{
      if(res == null || res == "undefined"){
        return 0.00;
      }
      items = JSON.parse(res);
    });
    if(items) {
      for (var i = 0; i < items.length; i++) {
        amount += (items[i].distPrice * items[i].qty);
      }
    }
    return amount;
  }

}
