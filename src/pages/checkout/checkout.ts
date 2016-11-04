/**
 * Created by hevan on 16/9/25.
 */
import {Component} from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';
import {Http,URLSearchParams} from '@angular/http';
import {CommonServices} from "../../commons/services/CommonServices";
import {MyAddressPage} from "../personal/MyAddress/MyAddress";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector:'page-checkout',
  templateUrl: 'checkout.html',
  providers: [CommonServices]
})

export class CheckoutPage {
  public orderId:any;
  public orders:any;
  public orderItems:any;
  public productCount:any;
  public addrShow:string = '';

  constructor(
    public params: NavParams,
    public commonService: CommonServices,
    public http:Http,
    public navCtl: NavController
  ) {
    this.orderId = params.get('orderId');
    this.productCount = 0;
    this.addrShow = '';
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
        if(null == this.orders.dispatchAddr){
          this.addrShow = '';
        }else{
          this.addrShow = this.orders.dispatchAddr;
        }
        this.orderItems = this.orders.items;
        this.productCount = this.orderItems.length;
        console.log(this.orders);
        console.log(this.productCount);
      });
  }

  goAddress() {
    this.navCtl.push(MyAddressPage,{'orderId':this.orderId});
  }
}

