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
  sortName:string = 'distPrice';
  sortType:string = '0';
  curCategoryNo:string='';
  items:any;
  listCategory:any;

  constructor(private navCtrl: NavController, private http: Http, private commonService: CommonServices, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.loadData();
    this.loadCategory();
  }

  loadData(){
    let params = new URLSearchParams();
    params.set('categoryNo',this.curCategoryNo);
    params.set('sortName',this.sortName);
    params.set('sortType',this.sortType);

    this.http.get(Keys.SERVICE_URL +'/product/findProductByCategory', {search:params}) .subscribe(res => {
      this.items = res.json();
    });
  }

  loadCategory () {
    this.http.get(Keys.SERVICE_URL +'/category/findAllCategory').subscribe(res => {
      this.listCategory = res.json();
    });
  }

  categorySelected(categoryNo){
    this.curCategoryNo = categoryNo;
    this.loadData();
  }

  switchSortType (sortName, sortType) { //排序方式样式切换
    this.sortName = sortName;
    this.sortType = sortType;
    this.loadData();
  }

  goToProductPage(productId){
    this.navCtrl.push(ProductPage,{id:productId});
  }
}
