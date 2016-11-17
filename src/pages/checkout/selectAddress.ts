import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage'
import {NavController, LoadingController, AlertController, NavParams, ViewController} from "ionic-angular";
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from "../../commons/constants/Keys";
import {MyAddressPage} from "../personal/MyAddress/MyAddress";

@Component({
  selector: 'page-select-address',
  templateUrl: 'selectAddress.html',
  providers: [CommonServices]
})

export class SelectAddressPage {
  public addresses: any = [];
  private userId: string;
  private orderId: string;

  constructor (private navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private http: Http, private storage: Storage, private commonService: CommonServices) {
    this.userId = navParams.get('userId');
    this.orderId = navParams.get('orderId');
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   * 加载用户收货地址数据
   */
  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    let loading = this.commonService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/userAddr/findUserAddrByUserId', {search: params}).subscribe((res) => {
      this.addresses = res.json().data;
      loading.dismiss();
    });
  }

  /**
   * 选择地址
   */
  selectAddress (address: any) {
    let params = new URLSearchParams();
    params.set('orderId', this.orderId);
    params.set('addrId', address.id);

    let loading = this.commonService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/orders/updateOrderAddress', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      if (res.json().success == 'true') {
        loading.dismiss();
        this.viewCtrl.dismiss({address: address});
      }
    });
  }

  /**
   * 管理收货地址
   */
  addressManager () {
    this.navCtrl.push(MyAddressPage);
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }
}
