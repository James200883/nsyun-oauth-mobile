import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {NavController, AlertController, LoadingController, NavParams} from 'ionic-angular';
import {CommonServices} from "../../commons/services/CommonServices";
import {UserCartService} from "../../commons/services/UserCartService";
import { Storage } from '@ionic/storage';
import {Keys} from "../../commons/constants/Keys";
import {OrderItem} from "../../commons/constants/OrderItem";
import {LoginPage} from "../login/login";
import {CheckoutPage} from "../checkout/checkout";

@Component({
  selector:'page-cart',
  templateUrl: 'cart.html',
  providers: [UserCartService, CommonServices]
})

export class CartPage {
  public cartList: any = [];
  public isChecked: boolean = false;
  public totalAmount: any = 0.00;
  private userId: string;

  constructor(public navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private http: Http, private storage: Storage, private commonService: CommonServices, private userCartService: UserCartService) {}

  /**
   * 页面载入加载购物车商品
   */
  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.userId = userInfo.id;
        this.storage.get(Keys.USER_CART_KEY + this.userId).then((cartInfo) => {
          if (cartInfo) {
            this.cartList = cartInfo;
          }
        });
      }
    });
  }

  ionViewDidLeave () {
    this.cartList = [];
    this.isChecked = false;
    this.totalAmount = 0.00;
  }

  /**
   * 全选
   */
  notificationAll () {
    this.totalAmount = 0.00;
    for (let i = 0; i < this.cartList.length; i++) {
      this.cartList[i].isChecked = this.isChecked;
      if (this.isChecked) {
        this.totalAmount += this.cartList[i].amount;
      }
    }
  }

  /**
   * 单选
   * @param item
   */
  notificationItem (item: any) {
    if (item.isChecked) {
      this.totalAmount -= item.amount;
    } else {
      this.totalAmount += item.amount;
    }
  }

  /**
   * 数量加/减
   * @param item
   * @param type
   */
  quantityChange (item: any, type: number) {
    if (type == 0) { //数量减
      if (item.qty > 1) {
        item.isChecked = true;
        item.qty -= 1;
        item.amount -= item.distPrice;
      }
    }
    if (type == 1) { //数量加
      item.isChecked = true;
      item.qty += 1;
      item.amount += item.distPrice;
    }
    this.calcChange();
  }

  /**
   * 删除购物车指定商品
   * @param index
   */
  delItem (index: number) {
    this.commonService.showConfirm('确认要删除这个宝贝吗？', this.alertCtrl, (callback) => {
      if (callback) {
        let orderItems: any = [];
        this.cartList.splice(index, 1);
        for (let i = 0; i < this.cartList.length; i++) {
          let orderItem = new OrderItem(this.cartList[i]);
          orderItems.push(orderItem);
        }
        this.userCartService.updateOrderItem(orderItems, this.userId);
      }
    });
  }

  //重新计算总金额
  private calcChange () {
    let orderItems: any = [];
    this.totalAmount = 0.00;
    for (let i = 0; i < this.cartList.length; i++) {
      if (this.cartList[i].isChecked) {
        this.totalAmount += this.cartList[i].amount;
      }
      let orderItem = new OrderItem(this.cartList[i]);
      orderItems.push(orderItem);
    }
    this.userCartService.updateOrderItem(orderItems, this.userId);
  }

  /**
   * 去结算
   */
  doOrder () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let items: any = [];
        for (let i = 0; i < this.cartList.length; i++) { //获取选中的商品
          if (this.cartList[i].isChecked) {
            items.push(this.cartList[i]);
          }
        }
        if (items.length == 0) {
          this.commonService.showToast('您还没有选择商品哦!', 'center');
          return;
        }

        let loading = this.commonService.showLoading(this.loadingCtrl);
        let body = {userId: this.userId, orderType: 1,items: items};

        this.http.post(Keys.SERVICE_URL + '/orders/genOrder', JSON.stringify(body), {headers: Keys.HEADERS}).subscribe((res) => {
          let result = res.json();
          loading.dismiss();
          if (result.success == 'true') {
            this.navCtrl.push(CheckoutPage, {orderId: result.orderId, userId: this.userId});
          } else {
            this.commonService.showToast(result.message, 'center');
          }
        });
      } else {
        this.navCtrl.push(LoginPage);
      }
    });
  }
}
