import {Component} from '@angular/core';
import {ViewController, NavParams} from "ionic-angular";

@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html'
})

export class CitiesPage {
  cities = [];

  constructor (private viewCtrl: ViewController, private navParams: NavParams) {
    let cities = navParams.get('cities');
    this.cities = cities;
  }

  /**
   *
   * @param item
   */
  itemSelected (areas, citiesName) {
    this.viewCtrl.dismiss({areas: areas, citiesName: citiesName});
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }
}
