import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";

@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html'
})

export class CitiesPage {
  public cities: any = [];

  constructor (private viewCtrl: ViewController, private navParams: NavParams) {
    let cities = navParams.get('cities');
    this.cities = cities;
  }

  public itemSelected (areas, citiesName) {
    this.viewCtrl.dismiss({areas: areas, citiesName: citiesName});
  }

  //关闭模态窗口
  public closeModal () {
    this.viewCtrl.dismiss();
  }
}
