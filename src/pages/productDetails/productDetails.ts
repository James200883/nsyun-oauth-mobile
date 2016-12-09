import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Storage} from '@ionic/storage';
import {NavParams, ModalController, NavController, LoadingController, ToastController} from "ionic-angular";
import {Keys} from "../../commons/constants/Keys";
import {SkuItemsPage} from "../skuItems/skuItems";
import {LoginPage} from "../login/login";
import {CheckOutPage} from "../checkout/checkout";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {MemberCertPage} from "../memberCert/memberCert";
import {UserCartService} from "../../commons/services/UserCartService";
import {OrderItem} from "../../commons/data/OrderItem";

@Component({
  selector: 'page-product-details',
  templateUrl: 'productDetails.html'
})

export class ProductDetailsPage {
  private productId: string;
  private quantity: number = 1;
  public productInfo: any;
  public imageItems: any = [];
  public cateType: string;
  public options: any = {initialSlide: 1, loop: true, autoplay: 3000};
  public selectedSkuItems: any = [];

  constructor (private navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private storage: Storage, private dialogsService: DialogsServices, private userCartService: UserCartService) {
    this.productId = navParams.get('productId');
  }

  ionViewDidEnter () {
    this.loadProductDetails();
  }

  //选择产品规格
  public showOptions (product: any) {
    let modal = this.modalCtrl.create(SkuItemsPage, {product: product});
    modal.onDidDismiss((data) => {
      if (data) {
        this.selectedSkuItems = [];
        this.selectedSkuItems.push(data.skuItem.name);
        this.quantity = data.quantity;
      }
    });
    modal.present();
  }

  //立即购买 跳转至填写订单页面
  public doBuy () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        if (this.productInfo.product.skuItems && this.productInfo.product.skuItems.length > 0 && (!this.selectedSkuItems || this.selectedSkuItems.length < 1)) {
          this.showOptions(this.productInfo.product);
          return;
        }

        let items: any = [];
        items.push(this.getItems());
        let body = {userId: userInfo.id, orderType: 1, items: items};

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/orders/genOrder', JSON.stringify(body), {headers: Keys.HEADERS}).subscribe((res) => {
          let result = res.json();
          loading.dismiss();
          if (result.success == 'true') {
            this.navCtrl.push(CheckOutPage, {orderId: result.orderId, userId: userInfo.id});
          } else {
            this.dialogsService.showToast(result.message, this.toastCtrl);
          }
        });
      } else {
        this.goToLogin();
      }
    });
  }

  //领取赠品
  public doGet () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let params = new URLSearchParams();
        params.set('productId', this.productId);
        params.set('userId', userInfo.id);
        params.set('orderType', '2');

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/orders/genGiftOrder', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          let result = res.json();
          loading.dismiss();
          if (result && result.success == 'true') {
            this.navCtrl.push(CheckOutPage, {orderId: result.orderId, userId: userInfo.id});
          } else {
            this.dialogsService.showToast(result.message, this.toastCtrl);
          }
        });
      } else {
        this.goToLogin();
      }
    });
  }

  //分期
  public doApply () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let params = new URLSearchParams();
        params.set('productId', this.productId);
        params.set('userId', userInfo.id);
        params.set('orderType', '3');

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/orders/genGiftOrder', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          let result = res.json();
          loading.dismiss();
          if (result && result.success == 'true') {
            this.navCtrl.push(CheckOutPage, {orderId: result.orderId, userId: userInfo.id});
          } else {
            this.dialogsService.showToast(result.message, this.toastCtrl);
            if (result.code == '200') {
              this.navCtrl.push(MemberCertPage, {userId: userInfo.id});
            }
          }
        });
      } else {
        this.goToLogin();
      }
    });
  }

  //加入购物车
  public addToCart () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        if (this.productInfo.product.skuItems && this.productInfo.product.skuItems.length > 0 && (!this.selectedSkuItems || this.selectedSkuItems.length < 1)) {
          this.showOptions(this.productInfo.product);
          return;
        }

        let orderItem = new OrderItem(this.getItems());
        this.userCartService.addOrderItem(orderItem, userInfo.id);
        this.dialogsService.showToast('已成功加入购物车', this.toastCtrl);
      } else {
        this.goToLogin();
      }
    });
  }

  //加载商品详情
  private loadProductDetails () {
    let params = new URLSearchParams();
    params.set('id', this.productId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/product/getProductInfoById', {search: params}).subscribe((res) => {
      let result = res.json();
      this.productInfo = result.productInfo;
      this.imageItems = result.imageItems;
      let categoryNo = result.productInfo.product.category.categoryNo;
      this.cateType = categoryNo.substr(0, 2);
      loading.dismiss();
    });
  }

  //跳转登陆
  private goToLogin () {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(() => {
      this.loadProductDetails();
    });
    modal.present();
  }

  private getItems (): any {
    let items = {
      productId: this.productId,
      name: this.productInfo.product.name,
      imageUrl: this.productInfo.product.imageUrl,
      sku: this.selectedSkuItems.join(','),
      qty: this.quantity,
      price: parseFloat(parseFloat(this.productInfo.product.price).toFixed(2)),
      distPrice: parseFloat(parseFloat(this.productInfo.product.distPrice).toFixed(2)),
      isChecked: false
    };
    return items;
  }
}
