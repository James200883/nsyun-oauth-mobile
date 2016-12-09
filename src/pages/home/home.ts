import { Component } from '@angular/core';
import {URLSearchParams, Http} from "@angular/http";
import {Storage} from '@ionic/storage';
import {Keys} from "../../commons/constants/Keys";
import {NavController, ModalController} from "ionic-angular";
import {ProductDetailsPage} from "../productDetails/productDetails";
import {OrdersPage} from "../orders/orders";
import {LoginPage} from "../login/login";
import {SalesPage} from "../sales/sales";
import {MemberCertPage} from "../memberCert/memberCert";
import {MessagesPage} from "../message/message";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public options: any = {initialSlide: 1, loop: true, autoplay: 3000};
  public slides: any = [];
  public zpData: any = [];
  public cxData: any = [];
  public fqData: any = [];

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private http: Http, private storage: Storage) {
    let params = new URLSearchParams();
    params.set('pagePos', 'page_home');

    this.http.get(Keys.SERVICE_URL + '/pageAds/findPagePosData', {search: params}).subscribe((res) => {
      let retData = res.json();
      this.slides = retData.bannerData;
      this.zpData = retData.pagePosData1;
      this.cxData = retData.pagePosData2;
      this.fqData = retData.pagePosData3;
    });
  }

  //跳转至产品详情页面
  public goProductDetail (productId: string) {
    this.navCtrl.push(ProductDetailsPage, {productId: productId});
  }

  //跳转至我的订单
  public goToOrders () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.navCtrl.push(OrdersPage, {userId: userInfo.id});
      } else {
        this.goToLogin();
      }
    });
  }

  //跳转至促销产品页面
  public goToSales () {
    this.navCtrl.push(SalesPage, {cateNo: '', cateName: '所有分类'});
  }

  //跳转至会员认证
  public goToMemberCert () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.navCtrl.push(MemberCertPage, {userId: userInfo.id});
      } else {
        this.goToLogin();
      }
    });
  }

  //跳转至我的消息
  public goToMessages () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.navCtrl.push(MessagesPage, {userId: userInfo.id});
      } else {
        this.goToLogin();
      }
    });
  }

  //跳转登陆
  private goToLogin () {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
}
