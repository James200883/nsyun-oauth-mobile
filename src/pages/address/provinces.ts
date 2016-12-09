import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {CitiesData} from "../../commons/data/citiesData";
@Component({
  selector: 'page-province',
  templateUrl: 'provinces.html'
})

export class ProvincesPage {
  public provinces: any = [];

  constructor (private viewCtrl: ViewController) {
    for (let province of CitiesData.cities) {
      this.provinces.push(province);
    }
  }

  public itemSelected (cities, provinceName) {
    this.viewCtrl.dismiss({cities: cities, provinceName: provinceName});
  }

  //关闭模态窗口
  public closeModal () {
    this.viewCtrl.dismiss();
  }
}
