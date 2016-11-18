import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage';
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, LoadingController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";

@Component({
  selector: 'page-my-coupon',
  templateUrl: 'MyCoupon.html',
  providers: [CommonServices]
})

export class MyCouponPage {
  public couponData: any = [];

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let loading = this.commonService.showLoading(this.loadingCtrl);
        let params = new URLSearchParams();
        params.set('userId', userInfo.id);

        this.http.post(Keys.SERVICE_URL + '/userCoupon/getUserCoupon', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          this.couponData = res.json().data;
          loading.dismiss();
        });
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }
}
