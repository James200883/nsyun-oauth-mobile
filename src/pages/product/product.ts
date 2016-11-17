import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {Http,URLSearchParams} from '@angular/http';
import { Storage } from '@ionic/storage';
import {NavParams} from "ionic-angular/index";
import {UserCartService} from "../../commons/services/UserCartService";
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from "../../commons/constants/Keys";
import {GiftPage} from "../gift/gift";
import {LoginPage} from  "../login/login";
import {UserIdentificationPage} from "../personal/identification/UserIdentification";
import {OrderItem} from "../../commons/constants/OrderItem";
import {CartPage} from "../cart/cart";

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
  providers: [CommonServices, UserCartService]
})

export class ProductPage {
  private productId: string;
  public productInfo: any;

  constructor (public navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private http: Http, private storage: Storage, private commonService: CommonServices, private userCartService: UserCartService) {
    this.productId = navParams.get('id');
  }

  /**
   * 隐藏tabs
   */
  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   * 进入页面加载数据
   */
  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('id', this.productId);

    this.http.get(Keys.SERVICE_URL + '/product/getProductInfoById', {search: params}).subscribe((res) => {
      this.productInfo = res.json();
    });
  }

  /**
   * 领取赠品
   */
  doGiftConfirm () {
    this.commonService.showConfirm('确认领取该礼品？', this.alertCtrl, (callback) => {
      if (callback) {
        this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
          if (userInfo) {
            let loading = this.commonService.showLoading(this.loadingCtrl);
            let params = new URLSearchParams();
            params.set('productId', this.productId);
            params.set('userId', userInfo.id);
            params.set('orderType', '2');

            this.http.post(Keys.SERVICE_URL + '/orders/genGiftOrder', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
              let result = res.json();
              if (result && result.success == 'true') {
                loading.dismiss();
                this.navCtrl.push(GiftPage, {'orderId': result.orderId});
              } else {
                this.commonService.showToast(result.message, 'center');
              }
            });
          } else {
            this.navCtrl.push(LoginPage);
          }
        });
      }
    });
  }

  /**
   * 立即购买
   */
  doBuy () {
    let buyConfirm = this.alertCtrl.create({
      title: '',
      message: '确认购买？',
      buttons: [
        {text: '加入购物车',
         handler: () => {
           this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
             if (userInfo) {
               let data = {
                 productId: this.productId,
                 name: this.productInfo.product.name,
                 imageUrl: this.productInfo.product.imageUrl,
                 spec: this.productInfo.product.spec,
                 qty: 1,
                 price: parseFloat(parseFloat(this.productInfo.product.price).toFixed(2)),
                 distPrice: parseFloat(parseFloat(this.productInfo.product.distPrice).toFixed(2)),
                 isChecked: false
               };

               let orderItem = new OrderItem(data);
               this.userCartService.addOrderItem(orderItem, userInfo.id);
             } else {
               this.navCtrl.push(LoginPage);
             }
           });
         }},
        {
          text: '立即购买',
          handler: () => {
            this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
              if (userInfo) {
                let data = {
                  productId: this.productId,
                  name: this.productInfo.product.name,
                  imageUrl: this.productInfo.product.imageUrl,
                  spec: this.productInfo.product.spec,
                  qty: 1,
                  price: parseFloat(parseFloat(this.productInfo.product.price).toFixed(2)),
                  distPrice: parseFloat(parseFloat(this.productInfo.product.distPrice).toFixed(2)),
                  isChecked: false
                };

                let orderItem = new OrderItem(data);
                this.userCartService.addOrderItem(orderItem, userInfo.id);

                this.navCtrl.push(CartPage);
              } else {
                this.navCtrl.push(LoginPage);
              }
            });
          }
        }
      ]
    });
    buyConfirm.present();
  }

  /**
   * 分期
   */
  doAppoint () {
    this.commonService.showConfirm('分期购买优惠多', this.alertCtrl, (callback) => {
      if (callback) {
        this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
          if (userInfo) {
            let loading = this.commonService.showLoading(this.loadingCtrl);
            let params = new URLSearchParams();
            params.set('productId', this.productId);
            params.set('userId', userInfo.id);
            params.set('orderType', '3');

            this.http.post(Keys.SERVICE_URL + '/orders/genGiftOrder', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
              let result = res.json();
              if (result && result.success == 'true') {
                loading.dismiss();
                this.navCtrl.push(GiftPage, {'orderId': result.orderId});
              } else {
                this.commonService.showToast(result.message, 'center');
                if (result.code == '200') {
                  this.navCtrl.push(UserIdentificationPage);
                }
              }
            });
          } else {
            this.navCtrl.push(LoginPage);
          }
        });
      }
    });
  }
}
