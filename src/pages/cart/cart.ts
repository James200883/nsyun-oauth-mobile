import { Component} from '@angular/core';
import {Http} from '@angular/http';
import { NavController, AlertController} from 'ionic-angular';
import {CommonServices} from "../../commons/services/CommonServices";
import {UserCartService} from "../../commons/services/UserCartService";
import {OrderItem} from "../../commons/constants/OrderItem";
import {Keys} from "../../commons/constants/Keys";
import {CheckoutPage} from "../checkout/checkout";
import {LoginPage} from  "../login/login";
import { Storage } from '@ionic/storage';

@Component({
  selector:'page-cart',
  templateUrl: 'cart.html',
  providers: [UserCartService,CommonServices]
})
export class CartPage {

  public cartList:Array<OrderItem>;
  public productCount:any =0;
  public totalAmount:any = 0.00;

  constructor(public navCtrl:NavController,private alerCtrl:AlertController, public storage:Storage,private userCartService:UserCartService,private http:Http,private commonService:CommonServices) {

  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'flex';
  }

  ionViewDidEnter(){
  this.loadData();
  }
  loadData(){
    this.storage.get(Keys.USER_CART_KEY).then(res =>{
      console.log(res);
      if(res == null || res == "undefined"){
        console.log("return null");

      }else{
        console.log("return item");
        this.cartList = res;
        this.productCount = this.cartList.length;
        let amount = 0;
        for(var i=0;i<this.cartList.length;i++){
          let deItem = this.cartList[i];
          amount += deItem.distPrice * deItem.qty;
        }
        this.totalAmount = amount;
      }
    });
  }

  removeItemFromCart(item){
    let newItems = new Array<OrderItem>();
    for(var i=0;i<this.cartList.length;i++){
      let deItem = this.cartList[i];
      if(deItem.productId == item.productId){

      }else{
        newItems.push(deItem);
      }
    }
    this.cartList = newItems;

    this.calcChange();
  }

  quantityPlus(item){
    this.quantityChange(item,1);
  }

  quantityChange(item, qty){
    let amount = 0.00;
    for(var i=0;i<this.cartList.length;i++){
      let deItem = this.cartList[i];
      if(deItem.productId == item.productId){
        deItem.qty = deItem.qty + qty;
        amount += deItem.distPrice * deItem.qty;
      }
    }
    this.totalAmount = amount;

    this.userCartService.saveItems(this.cartList);
  }

  calcChange(){
    let amount = 0;

    for(var i=0;i<this.cartList.length;i++){
      let deItem = this.cartList[i];

      amount += deItem.distPrice * deItem.qty;

    }
    this.totalAmount = amount;

    this.userCartService.saveItems(this.cartList);
  }

  quantityMinus(item){
    if(item.sellCount > 1){
      this.quantityChange(item,-1);
    } else {
      let removeAlert = this.alerCtrl.create({
        title: 'Error',
        subTitle: 'Quantity is 1, you cant reduce it, if you want to remove, please press remove button.',
        buttons: ['Ok']
      });
      removeAlert.present();
    }
  }

  checkout(){
    let userId;
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
         userId =userInfo.id;
      } else {
        this.navCtrl.push(LoginPage);
      }
    });

    let body = {userId:userId, orderType:1,items:this.cartList};
    this.http.post(Keys.SERVICE_URL + '/orders/genOrder', JSON.stringify(body),{headers:Keys.HEADERS})
      .subscribe(res => {
        let retData = res.json();
        console.log(retData);
        if(retData.success === 'true'){
          this.navCtrl.push(CheckoutPage, {'orderId':retData.orderId});
        }else{
          this.commonService.showAlert(retData.message, this.alerCtrl);
        }
      });

  }
}
