import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController} from 'ionic-angular';
import {Http,URLSearchParams} from '@angular/http';
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from '../../commons/constants/Keys'
import {ProductPage} from "../product/product";

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
  providers: [CommonServices]
})
export class SalesPage {
  zhClass: string = 'cur';
  xlClass: string;
  jgClass: string = 'sortPrice';
  upOrDown: string = '';
  curCategoryNo:string='10';
  items:any;

  constructor(private navCtrl: NavController, private http: Http, private commonService: CommonServices, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.loadData();
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'flex';
  }

  loadData(){
    let params = new URLSearchParams();
    params.set('categoryNo',this.curCategoryNo);
    this.http.get(Keys.SERVICE_URL +'/product/findProductByCategory', {search:params}) .subscribe(res => {
      this.items = res.json();
      console.log(this.items);
    });
  }

  switchSortType (flag) { //排序方式样式切换
    switch (flag){
      case 1:
        this.zhClass = 'cur';
        this.xlClass = '';
        this.jgClass = 'sortPrice';
        this.upOrDown = '';
        this.curCategoryNo = "10";
        break;
      case 2:
        this.xlClass = 'cur';
        this.zhClass = '';
        this.jgClass = 'sortPrice';
        this.upOrDown = '';
        this.curCategoryNo = "20";
        break;
      case 3:
        this.jgClass = 'sortPrice cur';
        this.zhClass = '';
        this.xlClass = '';
        if (this.upOrDown == 'up') {
          this.upOrDown = 'down';
        } else if (this.upOrDown == 'down') {
          this.upOrDown = 'up';
        } else {
          this.upOrDown = 'up';
        }
        this.curCategoryNo = "30";
        break;
    }

    this.loadData();

  }

  goToProductPage(productId){

    console.log(productId);
    this.navCtrl.push(ProductPage,{id:productId});
  }

}
