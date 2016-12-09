import {Component} from "@angular/core";
import {Storage} from '@ionic/storage';
import {Keys} from "../../commons/constants/Keys";
import {OrderItem} from "../../commons/data/OrderItem";
import {UserCartService} from "../../commons/services/UserCartService";
import {AlertController, ToastController, LoadingController, NavController} from "ionic-angular";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Http} from "@angular/http";
import {CheckOutPage} from "../checkout/checkout";

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})

export class CartPage {
  private userId: string;
  public cartList: any = [];
  public isChecked: boolean = false;
  public totalAmount: any = 0.00;

  constructor (private navCtrl: NavController, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private storage: Storage, private http: Http,private userCartService: UserCartService, private dialogsService: DialogsServices) {}

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

  //全选
  public notificationAll () {
    this.totalAmount = 0.00;
    for (let i = 0; i < this.cartList.length; i++) {
      this.cartList[i].isChecked = this.isChecked;
      if (this.isChecked) {
        this.totalAmount += this.cartList[i].amount;
      }
    }
  }

  //选择单个
  public notificationItem (item: any) {
    if (item.isChecked) {
      this.totalAmount -= item.amount;
    } else {
      this.totalAmount += item.amount;
    }
  }

  //数量加/减
  public quantityChange (item: any, type: number) {
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

  //删除购物车指定商品
  public delItem (index: number) {
    this.dialogsService.showConfirm('确认要删除这个宝贝吗', this.alertCtrl, callback => {
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

  //去结算
  public doOrder () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let items: any = [];
        for (let i = 0; i < this.cartList.length; i++) { //获取选中的商品
          if (this.cartList[i].isChecked) {
            items.push(this.cartList[i]);
          }
        }
        if (items.length == 0) {
          this.dialogsService.showToast('您还没有选择商品哦', this.toastCtrl);
          return;
        }

        let body = {userId: this.userId, orderType: 1,items: items};

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/orders/genOrder', JSON.stringify(body), {headers: Keys.HEADERS}).subscribe((res) => {
          let result = res.json();
          loading.dismiss();
          if (result.success == 'true') {
            this.navCtrl.push(CheckOutPage, {orderId: result.orderId, userId: this.userId});
          } else {
            this.dialogsService.showToast(result.message, this.toastCtrl);
          }
        });
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
}
