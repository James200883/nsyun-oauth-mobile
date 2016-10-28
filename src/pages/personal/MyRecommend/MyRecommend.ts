import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage';
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, LoadingController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";
import {LoginPage} from "../../login/login";

@Component({
  selector: 'page-my-recommend',
  templateUrl: 'MyRecommend.html',
  providers: [CommonServices]
})

export class MyRecommendPage {
  recommendMembers = [];

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let loading = this.commonService.showLoading(this.loadingCtrl);
        let params = new URLSearchParams();
        params.set('user.id', userInfo.id);

        this.http.get(Keys.SERVICE_URL + '/userFollow/findAllUserFollow', {search: params}).subscribe((res) => {
          loading.dismiss();
          this.recommendMembers = res.json();
        });
      } else {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }
}
