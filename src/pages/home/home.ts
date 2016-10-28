import { Component } from '@angular/core';
import {NavController,AlertController,LoadingController} from 'ionic-angular';
import {Http,URLSearchParams} from '@angular/http';
import { Storage } from '@ionic/storage';
import {ProductPage} from "../product/product";
import {BlogListPage} from "../blog/BlogList";
import {Keys} from "../../commons/constants/Keys";
import {PersonalPage} from "../personal/personal";
import {SalesPage} from "../sales/sales";
import {UserIdentificationPage} from "../personal/identification/UserIdentification";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  options = {initialSlide: 1, loop: true, autoplay: 3000};
  slides = [];
  zpData = [];
  cxData = [];
  fqData = [];
  cartCount:number = 0;

  constructor(private navCtrl: NavController, private storage:Storage, private http: Http, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

    this.loadData();
  }

  goToProductPage(productId){
    this.navCtrl.push(ProductPage,{id:productId});
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'flex';
  }

  loadData(){
    let params = new URLSearchParams();
    params.set('pagePos', 'page_home');
    this.http.get(Keys.SERVICE_URL + '/pageAds/findPagePosData', {search:params})
      .subscribe(res => {
        let retData = res.json();
        this.slides = retData.bannerData;

        this.zpData = retData.pagePosData1;

        this.cxData = retData.pagePosData2;

        this.fqData = retData.pagePosData3;
      });
  }



  formatBigDecimal(data){
    return parseFloat(data).toFixed(2);
  }

  public openPage(pageId:number){
    switch (pageId) {
      case 1:
        this.navCtrl.push(PersonalPage);
        break;
      case 2:
        this.navCtrl.push(SalesPage);
        break;
      case 3:
        this.navCtrl.push(UserIdentificationPage);
        break;
      case 4:
        this.navCtrl.push(BlogListPage);
        break;
    }
  }

}
