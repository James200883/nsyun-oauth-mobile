import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";
import {CitiesData} from "../../../commons/data/citiesData";

@Component({
  selector: 'page-provinces',
  templateUrl: 'provinces.html'
})

export class ProvincesPage {
  provinces = [];

  constructor (private viewCtrl: ViewController) {
    for (let province of CitiesData.cities) {
      this.provinces.push(province);
    }
  }

  itemSelected (cities, provinceName) {
    this.viewCtrl.dismiss({cities: cities, provinceName: provinceName});
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }
}
