import {Component} from "@angular/core";
import {NavParams, LoadingController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector: 'page-coupon',
  templateUrl: 'coupon.html'
})

export class CouponPage {
  private userId: string;
  public couponsData: any = [];

  constructor (private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  //页面载入完成加载数据
  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/userCoupon/getUserCoupon', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      this.couponsData = res.json().data;;
      loading.dismiss();
    });
  }
}
