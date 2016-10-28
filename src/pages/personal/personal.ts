import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Http, URLSearchParams} from '@angular/http';
import {NavController} from "ionic-angular";
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from "../../commons/constants/Keys";
import {LoginPage} from "../login/login";
import {MyOrdersPage} from "./MyOrders/MyOrders";
import {MyAddressPage} from "./MyAddress/MyAddress";
import {MyRecommendPage} from "./MyRecommend/MyRecommend";
import {MyCouponPage} from "./MyCoupon/MyCoupon";
import {MyMessagesPage} from "./MyMessages/MyMessages";
import {SettingsPage} from "./settings/settings";
import {UserIdentificationPage} from "./identification/UserIdentification"

@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html',
  providers: [CommonServices]
})

export class PersonalPage {
  userData: Object = null;

  constructor (private navCtrl: NavController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let params = new URLSearchParams();
        params.set('userId', userInfo.id);

        this.http.post(Keys.SERVICE_URL + '/member/userIndex', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          this.userData = res.json().result;
        });
      } else {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'flex';
  }

  openDetails (item: number) {
    switch (item) {
      case 1:
        this.navCtrl.push(MyOrdersPage);
        break;
      case 2:
        this.navCtrl.push(MyAddressPage);
        break;
      case 3:
        this.navCtrl.push(MyRecommendPage);
        break;
      case 4:
        this.navCtrl.push(MyCouponPage);
        break;
      case 5:
        this.navCtrl.push(MyMessagesPage);
        break;
      case 6:
        this.navCtrl.push(SettingsPage);
        break;
      case 10:
        this.navCtrl.push(UserIdentificationPage);
        break;
    }
  }
}
