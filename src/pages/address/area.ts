import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";

@Component({
  selector: 'page-area',
  templateUrl: 'area.html'
})

export class AreaPage {
  public areas: any = [];

  constructor (private viewCtrl: ViewController, private navParams: NavParams) {
    let areas = navParams.get('areas');
    this.areas = areas;
  }

  public itemSelected (areaName) {
    this.viewCtrl.dismiss({areaName: areaName});
  }

  //关闭模态窗口
  public closeModal () {
    this.viewCtrl.dismiss();
  }
}
