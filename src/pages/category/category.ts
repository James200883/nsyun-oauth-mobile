import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {NavController} from "ionic-angular";
import {SalesPage} from "../sales/sales";

@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})

export class CategoryPage {
  public categories: any = [];

  constructor (private navCtrl: NavController, private http: Http) {
    this.http.get(Keys.SERVICE_URL + '/category/findAllCategory').subscribe((res) => {
      this.categories = res.json();
    });
  }

  //根据分类ID查找商品
  public goToProducts (categoryNo: string, categoryName: string) {
    this.navCtrl.push(SalesPage, {cateNo: categoryNo, cateName: categoryName});
  }
}
