import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { PersonalPage } from '../personal/personal';
import {CategoryPage} from "../category/category";
import {CartPage} from "../cart/cart";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  indexRoot: any = HomePage;
  categoryRoot: any = CategoryPage;
  cartRoot: any = CartPage;
  personalRoot: any = PersonalPage;

  constructor() {

  }
}
