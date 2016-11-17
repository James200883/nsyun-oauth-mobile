import {Component} from '@angular/core';
import {NavParams, NavController, LoadingController, ModalController, ToastController} from 'ionic-angular';
import {Http,URLSearchParams} from '@angular/http';
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from "../../commons/constants/Keys";
import {SelectAddressPage} from "./selectAddress";
import {AliPay} from "ionic-native";
import {MyOrdersPage} from "../personal/MyOrders/MyOrders";

@Component({
  selector:'page-checkout',
  templateUrl: 'checkout.html',
  providers: [CommonServices]
})

export class CheckoutPage {
  private orderId: string;
  private userId: string;
  public addressInfo: any;
  public payType: string;
  public orderInfos: any = {};
  public orderItems: any = [];

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private commonService: CommonServices) {
    this.orderId = navParams.get('orderId');
    this.userId = navParams.get('userId');
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('id', this.orderId);

    this.http.get(Keys.SERVICE_URL + '/orders/getOrdersById', {search: params}).subscribe((res) => {
      let result = res.json();
      this.orderInfos = result;
      this.orderItems = result.items;
      if (result.contactUserName && result.contractTel && result.province && result.city && result.area) {
        this.addressInfo = {};
      }
      if (result.contactUserName) {
        this.addressInfo.contactUserName = result.contactUserName;
      }
      if (result.contractTel) {
        this.addressInfo.contractTel = result.contractTel;
      }
      if (result.province) {
        this.addressInfo.province = result.province;
      }
      if (result.city) {
        this.addressInfo.city = result.city;
      }
      if (result.area) {
        this.addressInfo.area = result.area;
      }
    });
  }

  /**
   * 选择收货地址
   */
  goAddress () {
    let modal = this.modalCtrl.create(SelectAddressPage, {userId: this.userId, orderId: this.orderId});
    modal.onDidDismiss((data) => {
      if (data) {
        this.addressInfo = data.address;
      }
    });
    modal.present();
  }

  /**
   *
   * @param type
   */
  selectPayType (type: string) {
    this.payType = type;
  }

  /**
   * 提交订单
   */
  submitOrder () {
    if (!this.addressInfo) {
      this.commonService.showToastByHtml(this.toastCtrl, '请选择收货地址');
      return;
    }
    if (!this.payType) {
      this.commonService.showToastByHtml(this.toastCtrl, '请选择支付方式');
      return;
    }
    if (this.payType == '1') { // 支付宝支付
      this.aliPay();
    }
  }

  private aliPay () {
    let params = new URLSearchParams();
    params.set('tradeNo', this.orderInfos.orderNo);
    params.set('subject', this.orderInfos.items[0].name);
    params.set('body', this.orderInfos.items[0].name);
    params.set('price', this.orderInfos.amount);
    //params.set('price', '0.01');
    params.set('notifyUrl', Keys.SERVICE_URL + '/aliPay/payCallBack');

    this.http.post(Keys.SERVICE_URL + '/aliPay/getPayInfo', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let payInfo = res.json().payInfo;
      AliPay.pay(payInfo).then((result) => {
        let status = result.resultStatus;
        if (status == 9000) {
          this.commonService.showToastByHtml(this.toastCtrl, '支付成功');
          this.navCtrl.push(MyOrdersPage);
        } else if (status == 8000) {
          this.commonService.showToastByHtml(this.toastCtrl, '等待支付结果确认');
        } else {
          this.commonService.showToastByHtml(this.toastCtrl, '支付失败');
        }
      });
    });
  }
}

