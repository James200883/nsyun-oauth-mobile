/**
 * Created by hevan on 16/9/25.
 */
import {Component} from '@angular/core';
import { Platform, NavParams, NavController} from 'ionic-angular';
import {Http, URLSearchParams} from '@angular/http';
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector:'page-gift',
  templateUrl: 'gift.html',
  providers: [CommonServices]
})

export class GiftPage {
  public orderId:any;
  public orders:any;
  public orderItems:any;
  public productCount:any;

  constructor(
    public platform: Platform,
    public http:Http,
    public params: NavParams,
    public commonService: CommonServices,
    public navCtl: NavController
  ) {
    this.orderId = params.get('orderId');
    this.productCount=0;
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  ionViewDidEnter(){
    let params = new URLSearchParams();
    params.set('id', this.orderId+'');
    this.http.get(Keys.SERVICE_URL + '/orders/getOrdersById', {search:params})
      .subscribe(res => {
        this.orders = res.json();
        this.orderItems = this.orders.items;
        this.productCount = this.orderItems.length;
      });
  }

}
