/**
 * Created by hevan on 2016/10/17.
 */
import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage';
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";
import {LoginPage} from "../../login/login";

@Component({
  selector: 'page-user-ident-shop',
  templateUrl: 'UserIdentShop.html',
  providers: [CommonServices]
})

export class UserIdentShopPage {
  shops = [];
  corps = [];
  private shopId:string;
  private corpId:string;
  private userId:string;
  private cityName:string;
  private areaName:string;


  constructor (public navCtrl: NavController,public params: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, public http: Http, private storage: Storage, private commonService: CommonServices) {

    this.cityName = params.get('cityName');
    this.areaName = params.get('areaName');

    console.log(this.cityName);
    console.log(this.areaName);


    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let loading = this.commonService.showLoading(this.loadingCtrl);
        let params = new URLSearchParams();
        params.set('userId', userInfo.id);
        this.userId = userInfo.id;

        this.http.get(Keys.SERVICE_URL + '/tradeUser/findTradeUserByUserId',  {search: params}).subscribe((res) => {
          let tradeUser = res.json();

          if(null != tradeUser){
            if(null != tradeUser.shop) {
              this.shopId = tradeUser.shop.id;
              this.corpId = tradeUser.corp.id;
            }else if(null != tradeUser.corp){
              this.corpId = tradeUser.corp.id;
            }
          }
        });

        loading.dismiss();
      } else {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  ionViewDidEnter(){

    let paramsShop = new URLSearchParams();
    paramsShop.set('area',this.areaName);

    //加载店铺 //加载企业
    this.http.get(Keys.SERVICE_URL + '/shop/findAllShopByArea',  {search: paramsShop}).subscribe((res) => {
      this.shops = res.json();

      console.log(this.shops);

      paramsShop.set('city', this.cityName);
      if(null == res){
        this.http.get(Keys.SERVICE_URL + '/corp/findCorpByCity',  {search: paramsShop}).subscribe((resCorp) => {
          this.corps = resCorp.json();
          console.log(this.corps);
        });
      }
    });

    //
  }

  settingShop(shopId:string){
    let params = new URLSearchParams();
    params.set('userId',this.userId);
    params.set('shopId',shopId);

    //提交
    this.http.post(Keys.SERVICE_URL + '/tradeUser/saveTradeUser', {headers:Keys.HEADERS}, {search: params}).subscribe((res) => {
       let ret = res.json();
       if(ret.success == 'true'){
         this.navCtrl.pop();
       }else {
         this.commonService.showToastByHtml(this.toastCtrl, ret.message);
       }

    });
  }


  settingCorp(corpId:string){
    let params = new URLSearchParams();
    params.set('userId',this.userId);
    params.set('corpId',corpId);

    //提交
    this.http.post(Keys.SERVICE_URL + '/tradeUser/saveTradeUser', {headers:Keys.HEADERS}, {search: params}).subscribe((res) => {
      let ret = res.json();
      if(ret.success == 'true'){
        this.navCtrl.pop();
      }else {
        this.commonService.showToastByHtml(this.toastCtrl, ret.message);
      }

    });
  }

}
