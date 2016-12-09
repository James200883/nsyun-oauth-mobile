import { Component } from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import { Storage } from '@ionic/storage';
import {Keys} from "../../commons/constants/Keys";
import {ModalController, NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {OrdersPage} from "../orders/orders";
import {AddressPage} from "../address/address";
import {CouponPage} from "../coupon/coupon";
import {RecommendMemberPage} from "../recommendMember/RecommendMember";
import {MessagesPage} from "../message/message";
import {SettingsPage} from "../settings/settings";
import {AboutPage} from "../about/about";
import {SalesServicePage} from "../salesService/saleService";
import {MemberCertPage} from "../memberCert/memberCert";

@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html'
})

export class PersonalPage {
  public userInfoData: any;
  private userId: string;

  constructor (private modalCtrl: ModalController, private navCtrl: NavController, private http: Http, private storage: Storage) {}

  //页面完全载入完成加载数据
  ionViewDidEnter () {
    this.loadUserInfo();
  }

  //button items details
  public openItems (item: number) {
    switch (item) {
      case 1: //我的订单
        if (this.userInfoData) {
          this.navCtrl.push(OrdersPage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
      case 2: //我的收货地址
        if (this.userInfoData) {
          this.navCtrl.push(AddressPage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
      case 3: //我的优惠券
        if (this.userInfoData) {
          this.navCtrl.push(CouponPage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
      case 4: //我推荐的会员
        if (this.userInfoData) {
          this.navCtrl.push(RecommendMemberPage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
      case 5: //会员认证
        if (this.userInfoData) {
          this.navCtrl.push(MemberCertPage, {userId: this.userId})
        } else {
          this.goToLogin();
        }
        break;
      case 6: //售后服务
        if (this.userInfoData) {
          this.navCtrl.push(SalesServicePage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
      case 7: //我的消息
        if (this.userInfoData) {
          this.navCtrl.push(MessagesPage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
      case 8: //关于我们
        this.navCtrl.push(AboutPage);
            break;
      case 9: //个人资料管理
        if (this.userInfoData) {
          this.navCtrl.push(SettingsPage, {userId: this.userId});
        } else {
          this.goToLogin();
        }
        break;
    }
  }

  //加载用户信息
  private loadUserInfo () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let params = new URLSearchParams();
        params.set('userId', userInfo.id);

        this.http.post(Keys.SERVICE_URL + '/member/userIndex', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          this.userInfoData = res.json().result;
          this.userId = this.userInfoData.id;
        });
      } else {
        this.userInfoData = null;
        this.userId = null;
      }
    });
  }

  //跳转登陆
  private goToLogin () {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(() => {
      this.loadUserInfo();
    });
    modal.present();
  }

}
