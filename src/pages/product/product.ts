import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {Http,URLSearchParams} from '@angular/http';
import {NavParams} from "ionic-angular/index";
import {CartPage} from "../cart/cart";
import {UserCartService} from "../../commons/services/UserCartService";
import {CommonServices} from "../../commons/services/CommonServices";
import {OrderItem} from "../../commons/constants/OrderItem";
import {Keys} from "../../commons/constants/Keys";
import {GiftPage} from "../gift/gift";
import {LoginPage} from  "../login/login";
import { Storage } from '@ionic/storage';
import {UserIdentificationPage} from "../personal/identification/UserIdentification";


@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
  providers: [CommonServices,UserCartService]
})
export class ProductPage {
  public productInfo:any;
  public productId:any;

  constructor(private navCtrl: NavController,public alerCtrl: AlertController,
              private navParams: NavParams, public storage :Storage, private http:Http, private commonService: CommonServices,private userCartService: UserCartService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    console.log(navParams.get('id'));
    this.productId = navParams.get('id');
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  ionViewDidEnter(){
    let params = new URLSearchParams();

    params.set('id', this.productId);
    this.http.get(Keys.SERVICE_URL +'/product/getProductInfoById', {search:params})
      .subscribe(res => {
        this.productInfo = res.json();
        console.log(this.productInfo.product.name);
      });

  }

  doGiftConfirm() {

    let userId = '';
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {

        userId = userInfo.id;
      } else {
        this.navCtrl.push(LoginPage);
      }
    });

    let confirm = this.alerCtrl.create({
      title: '确认领取?',
      message: '确认领取该礼品么?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确认领取',
          handler: () => {

            let params = new URLSearchParams();
            params.set('productId', this.productId +'');
            params.set('userId', userId);
            params.set('orderType', "2");

            console.log(userId);

            this.http.post(Keys.SERVICE_URL +'/orders/genGiftOrder', {headers:Keys.HEADERS},{search:params})
              .subscribe(res => {
                let retData = res.json();
                console.log(retData);
                if(retData.success === 'true'){
                  this.navCtrl.push(GiftPage, {'orderId':retData.orderId});
                }else{
                  this.commonService.showAlert(retData.message, this.alertCtrl);
                }
              });

            console.log('Agree gift');
          }
        }
      ]
    });
    confirm.present()
  }

  doBuy() {
    let buyConfirm = this.alerCtrl.create({
      title: '确认购买',
      message: '确认购买这商品么?',
      buttons: [
        {
          text: '放入购物车',
          handler: () => {

            let orderItem = new OrderItem();
            orderItem.productId = this.productId;
            //console(this.productInfo.product.distPrice);
            orderItem.distPrice = +this.productInfo.product.distPrice;
            orderItem.price = +this.productInfo.product.price;
            orderItem.qty = 1;
            orderItem.name = this.productInfo.product.name;
            orderItem.imageUrl = this.productInfo.product.imageUrl;
            orderItem.amount = 1*orderItem.distPrice;

            console.log(JSON.stringify(orderItem));
            this.userCartService.addOrderItem(orderItem);

            console.log('Disagree clicked');
          }
        },
        {
          text: '立即购买',
          handler: () => {

            let orderItem = new OrderItem();
            orderItem.productId = this.productId;
            //console(this.productInfo.product.distPrice);
            orderItem.distPrice = +this.productInfo.product.distPrice;
            orderItem.price = +this.productInfo.product.price;
            orderItem.qty = 1;
            orderItem.name = this.productInfo.product.name;
            orderItem.imageUrl = this.productInfo.product.imageUrl;
            orderItem.amount = 1*orderItem.distPrice;

            //console.log(JSON.stringify(orderItem));
            this.userCartService.addOrderItem(orderItem);

            this.navCtrl.push(CartPage);

            console.log('start to buy clicked');
          }
        }
      ]
    });
    buyConfirm.present()
  }

  doAppoint() {

    let userId = '';
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {

        userId = userInfo.id;
      } else {
        this.navCtrl.push(LoginPage);
      }
    });

    let appointConfirm = this.alerCtrl.create({
      title: '分期购买?',
      message: '分期购买优惠多多?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确认分期购买',
          handler: () => {


            let params = new URLSearchParams();
            params.set('productId', this.productId +'');
            params.set('userId', userId);
            params.set('orderType', "3");

            this.http.post(Keys.SERVICE_URL +'/orders/genGiftOrder', {headers:Keys.HEADERS},{search:params})
              .subscribe(res => {
                let retData = res.json();
                console.log(retData);
                if(retData.success === 'true'){
                  this.navCtrl.push(GiftPage, {'orderId':retData.orderId});
                }else{
                  this.commonService.showAlert(retData.message, this.alerCtrl);
                  this.navCtrl.push(UserIdentificationPage);
                }
              });
            console.log('Agree clicked');
          }
        }
      ]
    });
    appointConfirm.present()
  }

}
