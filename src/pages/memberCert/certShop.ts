import {Component} from "@angular/core";
import {ViewController, NavParams, LoadingController} from "ionic-angular";
import {URLSearchParams, Http} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {DialogsServices} from "../../commons/services/DialogsServices";

@Component({
  selector: 'page-certShop',
  templateUrl: 'certShop.html'
})

export class CertShopPage {
  private areaName: string;
  private userId: string;
  public shops: any = [];

  constructor (private viewCtrl: ViewController, private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.areaName = navParams.get('areaName');
    this.userId = navParams.get('userId');
  }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('area', this.areaName);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/shop/findAllShopByArea', {search: params}).subscribe((res) => {
      this.shops = res.json();
      loading.dismiss();
    });
  }

  //选择商铺
  public selectShop (shop: any) {
    let params = new URLSearchParams();
    params.set('userId', this.userId);
    params.set('shopId', shop.id);

    this.http.post(Keys.SERVICE_URL + '/tradeUser/saveTradeUser', {headers:Keys.HEADERS}, {search: params}).subscribe((res) => {
      if (res.json().success == 'true') {
        this.viewCtrl.dismiss({shopName: shop.shopName});
      }
    });
  }

  public closeModal () {
    this.viewCtrl.dismiss();
  }
}
