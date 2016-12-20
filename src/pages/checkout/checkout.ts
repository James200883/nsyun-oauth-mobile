import {Component} from "@angular/core";
import {
  NavParams, LoadingController, ModalController, ToastController, NavController,
  AlertController
} from "ionic-angular";
import {URLSearchParams, Http} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {SelectAddressPage} from "./selectAddress";
import {AliPay, WeiXinPay} from "ionic-native";
import {PayResultPage} from "./result";

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html'
})

export class CheckOutPage {
  private orderId: string;
  private userId: string;
  public addressInfo: any;
  public payType: string;
  public orderInfos: any = {};
  public orderItems: any = [];

  constructor (private navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
    this.orderId = navParams.get('orderId');
  }

  //页面载入完成加载数据
  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('id', this.orderId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
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
      loading.dismiss();
    });
  }

  //选择收货地址
  public goAddress () {
    let modal = this.modalCtrl.create(SelectAddressPage, {userId: this.userId, orderId: this.orderId});
    modal.onDidDismiss((data) => {
      if (data) {
        this.addressInfo = data.address;
      }
    });
    modal.present();
  }

  //选择支付方式
  public selectPayType (type: string) {
    this.payType = type;
  }

  //支付
  public submitOrder () {
    if (!this.addressInfo) {
      this.dialogsService.showToast('请选择收货地址', this.toastCtrl);
      return;
    }
    if (!this.payType) {
      this.dialogsService.showToast('请选择支付方式', this.toastCtrl);
      return;
    }
    if (this.payType == '1') { // 支付宝支付
      this.aliPay();
    }
    if (this.payType == '2') { // 微信支付
      this.wxPay();
    }
  }

  //支付宝支付
  private aliPay () {
    let params = new URLSearchParams();
    params.set('tradeNo', this.orderInfos.orderNo);
    params.set('subject', this.orderInfos.items[0].name);
    params.set('body', this.orderInfos.items[0].name);
    params.set('price', this.orderInfos.amount);
    params.set('notifyUrl', Keys.SERVICE_URL + '/aliPay/payCallBack');

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/aliPay/getPayInfo', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let payInfo = res.json().payInfo;
      loading.dismiss();

      AliPay.pay(payInfo).then((result) => {
        let status = result.resultStatus;
        if (status == 9000) {
          this.dialogsService.showToast('支付成功', this.toastCtrl);
          this.navCtrl.push(PayResultPage, {userId: this.userId, totalPrice: this.orderInfos.amount});
        } else if (status == 8000) {
          this.dialogsService.showToast('等待支付结果确认', this.toastCtrl);
        } else {
          this.dialogsService.showToast('支付失败', this.toastCtrl);
        }
      });
    });
  }

  //微信支付
  private wxPay () {
    let params = new URLSearchParams();
    params.set('productName', this.orderInfos.items[0].name);
    params.set('productId', this.orderInfos.items[0].id);
    params.set('orderNo', this.orderInfos.orderNo);
    params.set('totalFee', this.orderInfos.amount);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/wxPay/unifiedorder', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let result = res.json();
      loading.dismiss();

      if (result.prepayid) {
        WeiXinPay.payment(result).then((payRes) => {
        });
      } else {
        this.dialogsService.showToast(result.err_code_des, this.toastCtrl);
      }
    });
  }
}
