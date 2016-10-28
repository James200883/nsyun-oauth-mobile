import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Keys} from "../../commons/constants/Keys";
import { HomePage } from '../home/home';
import { SalesPage } from '../sales/sales';
import { CartPage } from '../cart/cart';
import { PersonalPage } from "../personal/personal";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  indexRoot: any = HomePage;
  salesRoot: any = SalesPage;
  cartRoot: any = CartPage;
  personalRoot: any = PersonalPage;
  cartCount:number = 0;

  constructor(public storage:Storage) {

  }

  ionViewDidEnter(){
    this.loadCartData();
  }
  loadCartData(){
    this.cartCount = 0;
    this.storage.get(Keys.USER_CART_KEY).then(res =>{
      console.log(res);
      if(res == null || res == "undefined"){
        console.log("return null");

      }else{
        console.log("return item");
        let items = res;
        let qty = 0;
        for(var i=0;i<items.length;i++){
          let deItem = items[i];
          qty += deItem.qty;
        }

        this.cartCount = qty;
      }
    });
  }
}
