import {Component} from "@angular/core";
import {ViewController, NavParams, LoadingController, NavController} from "ionic-angular";
import {URLSearchParams, Http} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {AddressPage} from "../address/address";

@Component({
  selector: 'page-select-address',
  templateUrl: 'selectAddress.html'
})

export class SelectAddressPage {
  private userId: string;
  private orderId: string;
  public addresses: any = [];

  constructor (private navCtrl: NavController, private viewCtrl: ViewController, private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
    this.orderId = navParams.get('orderId');
  }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/userAddr/findUserAddrByUserId', {search: params}).subscribe((res) => {
      this.addresses = res.json().data;
      loading.dismiss();
    });
  }

  //选择收货地址
  public selectAddress (address: any) {
    let params = new URLSearchParams();
    params.set('orderId', this.orderId);
    params.set('addrId', address.id);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/orders/updateOrderAddress', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      if (res.json().success == 'true') {
        loading.dismiss();
        this.viewCtrl.dismiss({address: address});
      }
    });
  }

  //管理收货地址
  public addressManager () {
    this.navCtrl.push(AddressPage, {userId: this.userId});
  }

  //关闭模态窗口
  public closeModal () {
    this.viewCtrl.dismiss();
  }
}
