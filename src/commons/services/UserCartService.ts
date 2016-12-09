import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';
import {Keys} from "../constants/Keys";
import {OrderItem} from "../data/OrderItem";

@Injectable()
export class UserCartService {
  constructor (private storage: Storage) {}

  /**
   * 添加购物车
   * @param orderItem
   * @param userId
   */
  public addOrderItem (orderItem: OrderItem, userId: string) {
    let orderItems: any = [];
    let flag: boolean = true;
    this.storage.get(Keys.USER_CART_KEY + userId).then((cartInfo) => {
      if (cartInfo) {
        orderItems = cartInfo;
        for (let i = 0; i < orderItems.length; i++) {
          if (orderItems[i].productId == orderItem.getProductId()) {
            orderItems[i].qty += 1;
            orderItems[i].amount = parseFloat(orderItems[i].amount) + orderItem.getDisPrice();
            flag = false;
            break;
          }
        }

        if (flag) {
          orderItems.push(orderItem);
        }
        this.storage.set(Keys.USER_CART_KEY + userId, orderItems);
      } else {
        orderItems.push(orderItem);
        this.storage.set(Keys.USER_CART_KEY + userId, orderItems);
      }
    });
  }

  /**
   * 更新购物车数据
   * @param orderItems
   * @param userId
   */
  public updateOrderItem (orderItems: any, userId: string) {
    this.storage.remove(Keys.USER_CART_KEY + userId);
    this.storage.set(Keys.USER_CART_KEY + userId, orderItems);
  }
}
