import {Component} from "@angular/core";
import {ActionSheetController, NavParams, LoadingController, NavController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {ProductDetailsPage} from "../productDetails/productDetails";

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})

export class SalesPage {
  private sortName: string = 'distPrice';
  private sortType: string = '0';
  private categoryNo: string = '';
  public categoryName: string = '';
  public products: any = [];

  constructor (private navCtrl: NavController, private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.categoryNo = navParams.get('cateNo');
    this.categoryName = navParams.get('cateName');
    this.loadProducts();
  }

  //加载产品数据
  private loadProducts () {
    let params = new URLSearchParams();
    params.set('categoryNo', this.categoryNo);
    params.set('sortName', this.sortName);
    params.set('sortType', this.sortType);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/product/findProductByCategory', {search: params}).subscribe((res) => {
      this.products = res.json();
      loading.dismiss();
    });
  }

  //展示商品详情
  public productDetails (productId: string) {
    this.navCtrl.push(ProductDetailsPage, {productId: productId});
  }

  //价格排序
  public sortByPrice () {
    this.sortName = 'distPrice';
    let actionSheet = this.actionSheetCtrl.create({
      title: '排序',
      buttons: [
        {
          text: '价格从低到高',
          handler: () => {
            this.sortType = '0';
            this.loadProducts();
          }
        },
        {
          text: '价格从高到低',
          handler: () => {
            this.sortType = '1';
            this.loadProducts();
          }
        }
      ]
    });
    actionSheet.present();
  }

  //销量排序
  public sortBySaleCount () {
    this.sortName = 'countSale';
    this.sortType = '1';
    this.loadProducts();
  }
}
