import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

@Component({
  selector: 'page-areas',
  templateUrl: 'areas.html'
})

export class AreasPage {
  areas = [];

  constructor (private viewCtrl: ViewController, private navParams: NavParams) {
    let areas = navParams.get('areas');
    this.areas = areas;
  }

  /**
   *
   * @param item
   */
  itemSelected (areaName) {
    this.viewCtrl.dismiss({areaName: areaName});
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }
}
