import { Component } from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import { Storage } from '@ionic/storage';
import {NavController, LoadingController, AlertController, ToastController} from "ionic-angular";
import {CommonServices} from "../../../commons/services/CommonServices";
import {Keys} from "../../../commons/constants/Keys";
import {CheckoutPage} from "../../checkout/checkout";

@Component({
  selector: 'page-my-orders',
  templateUrl: 'MyOrders.html',
  providers: [CommonServices]
})

export class MyOrdersPage {
  public flag: string = '0';
  private userId: string;
  private _type: string;
  private page: string = '1';
  public hasMore: boolean = true;
  public orders: any = [];

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.userId = userInfo.id;
        this.searchOrders('noPay');
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   *
   * @param type
   */
  searchOrders (type: string) {
    this._type = type;
    this.page = '1';
    this.hasMore = true;
    this.orders = [];

    let loading = this.commonService.showLoading(this.loadingCtrl);

    let params = new URLSearchParams();
    params.set('page', this.page);
    params.set('userId', this.userId);
    params.set('type', type);

    this.http.get(Keys.SERVICE_URL + '/orders/getwxrechargeOrders', {search: params}).subscribe((res) => {
      let result = res.json();
      this.orders = result.data;
      this.hasMore = result.next_page > 0;
      this.page = result.next_page;
      loading.dismiss();
    });
  }

  /**
   * 上拉加载更多
   * @param infiniteScroll
   */
  doInfinite (infiniteScroll) {
    setTimeout(() => {
      let params = new URLSearchParams();
      params.set('page', this.page);
      params.set('userId', this.userId);
      params.set('type', this._type);

      this.http.get(Keys.SERVICE_URL + '/orders/getwxrechargeOrders', {search: params}).subscribe((res) => {
        let result = res.json();
        this.hasMore = result.next_page > 0;
        this.page = result.next_page;
        for (let order of result.data) {
          this.orders.push(order);
        }
        infiniteScroll.complete();
      });
    }, 1000);
  }

  /**
   * 删除订单
   * @param orderId
   * @param index
   */
  delOrder (orderId, index) {
    this.commonService.showConfirm('确认删除此订单?', this.alertCtrl, callback => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('orderId', orderId);
        this.http.post(Keys.SERVICE_URL + '/orders/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          if (res.json().success == 'true') {
            this.commonService.showToastByHtml(this.toastCtrl, '删除成功');
            this.orders.splice(index, 1);
          }
        });
      }
    })
  }

  /**
   * 去支付
   * @param order
   */
  goPay (order) {
    this.navCtrl.push(CheckoutPage, {orderId: order.orderId, userId: this.userId});
  }
}
