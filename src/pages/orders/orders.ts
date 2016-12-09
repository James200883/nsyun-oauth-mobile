import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {NavParams, LoadingController, AlertController, ToastController, NavController} from "ionic-angular";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {CheckOutPage} from "../checkout/checkout";

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})

export class OrdersPage {
  private userId: string;
  private _type: string;
  private page: string = '1';
  public hasMore: boolean = true;
  public orders: any = [];
  public flag: string = '0';

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private navParams: NavParams, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  //页面载入完成加载数据
  ionViewDidEnter () {
    this.searchOrders('noPay');
  }

  //上拉加载更多
  public doInfinite (infiniteScroll) {
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

  //删除订单
  public delOrder (orderId: string, index: number) {
    this.dialogsService.showConfirm('确认删除此订单?', this.alertCtrl, callback => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('orderId', orderId);
        this.http.post(Keys.SERVICE_URL + '/orders/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          if (res.json().success == 'true') {
            this.dialogsService.showToast('删除成功', this.toastCtrl);
            this.orders.splice(index, 1);
          }
        });
      }
    });
  }

  //未支付订单再次发起支付
  public goPay (orderInfo: any) {
    this.navCtrl.push(CheckOutPage, {orderId: orderInfo.orderId, userId: this.userId});
  }

  //查询我的订单
  public searchOrders (type: string) {
    this._type = type;
    this.page = '1';
    this.hasMore = true;
    this.orders = [];

    let params = new URLSearchParams();
    params.set('page', this.page);
    params.set('userId', this.userId);
    params.set('type', type);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/orders/getwxrechargeOrders', {search: params}).subscribe((res) => {
      let result = res.json();
      this.orders = result.data;
      this.hasMore = result.next_page > 0;
      this.page = result.next_page;
      loading.dismiss();
    });
  }
}
