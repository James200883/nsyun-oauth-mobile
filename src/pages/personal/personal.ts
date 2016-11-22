import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Http, URLSearchParams} from '@angular/http';
import {NavController, ModalController} from "ionic-angular";
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
import {AboutPage} from "./about/about"

@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html',
  providers: [CommonServices]
})

export class PersonalPage {
  public userData: any = null;

  constructor (private navCtrl: NavController, private modalCtrl: ModalController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.loadUserInfo();
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'flex';
  }

  private loadUserInfo () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let params = new URLSearchParams();
        params.set('userId', userInfo.id);

        this.http.post(Keys.SERVICE_URL + '/member/userIndex', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          this.userData = res.json().result;
        });
      }
    });
  }

  goToLogin () {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(() => {
      this.loadUserInfo();
    });
    modal.present();
  }

  openDetails (item: number) {
    switch (item) {
      case 1:
        if (this.userData) {
          this.navCtrl.push(MyOrdersPage);
        } else {
          this.goToLogin();
        }
        break;
      case 2:
        if (this.userData) {
          this.navCtrl.push(MyAddressPage);
        } else {
          this.goToLogin();
        }
        break;
      case 3:
        if (this.userData) {
          this.navCtrl.push(MyRecommendPage);
        } else {
          this.goToLogin();
        }
        break;
      case 4:
        if (this.userData) {
          this.navCtrl.push(MyCouponPage);
        } else {
          this.goToLogin();
        }
        break;
      case 5:
        if (this.userData) {
          this.navCtrl.push(MyMessagesPage);
        } else {
          this.goToLogin();
        }
        break;
      case 6:
        if (this.userData) {
          this.navCtrl.push(SettingsPage);
        } else {
          this.goToLogin();
        }
        break;
      case 7:
        if (this.userData) {
          this.navCtrl.push(AboutPage);
        } else {
          this.goToLogin();
        }
        break;
      case 10:
        if (this.userData) {
          this.navCtrl.push(UserIdentificationPage);
        } else {
          this.goToLogin();
        }
        break;
    }
  }
}
