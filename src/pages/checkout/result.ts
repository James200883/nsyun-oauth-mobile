import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {OrdersPage} from "../orders/orders";

@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})

export class PayResultPage {
  public totals:number = 0;
  private userId: string;

  constructor (private navCtrl: NavController, private navParams: NavParams) {
    this.totals = navParams.get('totalPrice');
    this.userId = navParams.get('userId');
  }

  //查看我的订单
  public toToOrder () {
    this.navCtrl.push(OrdersPage, {userId: this.userId});
  }
}
