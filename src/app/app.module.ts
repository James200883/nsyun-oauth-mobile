import { NgModule } from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import { MyApp } from './app.component';
import { SalesPage } from '../pages/sales/sales';
import { CartPage } from '../pages/cart/cart';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import {PersonalPage} from "../pages/personal/personal";
import {BlogListPage} from "../pages/blog/BlogList";
import {BlogDetailPage} from "../pages/blog/BlogDetail";
import {CheckoutPage} from "../pages/checkout/checkout";
import {GiftPage} from "../pages/gift/gift";
import {ProductPage} from "../pages/product/product";
import {MyOrdersPage} from "../pages/personal/MyOrders/MyOrders";
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {ForgotPassPage} from "../pages/forgotPass/forgotPass";
import {SubmitPassPage} from "../pages/forgotPass/submitPass";
import {MyAddressPage} from "../pages/personal/MyAddress/MyAddress";
import {MyRecommendPage} from "../pages/personal/MyRecommend/MyRecommend";
import {MyCouponPage} from "../pages/personal/MyCoupon/MyCoupon";
import {MyMessagesPage} from "../pages/personal/MyMessages/MyMessages";
import {MyMessagesContentPage} from "../pages/personal/MyMessages/MyMessagesContent";
import {SettingsPage} from "../pages/personal/settings/settings";
import {AddEditAddressPage} from "../pages/personal/MyAddress/AddEditAddress";
import {ProvincesPage} from "../pages/personal/MyAddress/provinces";
import {CitiesPage} from "../pages/personal/MyAddress/cities";
import {AreasPage} from "../pages/personal/MyAddress/areas";
import {UserIdentificationPage} from "../pages/personal/identification/UserIdentification";
import {UserIdentShopPage} from "../pages/personal/identification/UserIdentShop";
import {NickNamePage} from "../pages/personal/settings/nickName";
import {SelectAddressPage} from "../pages/checkout/selectAddress";

@NgModule({
  declarations: [
    MyApp,
    SalesPage,
    CartPage,
    HomePage,
    PersonalPage,
    TabsPage,
    BlogListPage,
    BlogDetailPage,
    CheckoutPage,
    GiftPage,
    ProductPage,
    MyOrdersPage,
    LoginPage,
    RegisterPage,
    ForgotPassPage,
    SubmitPassPage,
    MyAddressPage,
    MyRecommendPage,
    MyCouponPage,
    MyMessagesPage,
    MyMessagesContentPage,
    SettingsPage,
    AddEditAddressPage,
    ProvincesPage,
    CitiesPage,
    AreasPage,
    UserIdentificationPage,
    UserIdentShopPage,
    NickNamePage,
    SelectAddressPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SalesPage,
    CartPage,
    HomePage,
    PersonalPage,
    TabsPage,
    BlogListPage,
    BlogDetailPage,
    CheckoutPage,
    GiftPage,
    ProductPage,
    MyOrdersPage,
    LoginPage,
    RegisterPage,
    ForgotPassPage,
    SubmitPassPage,
    MyAddressPage,
    MyRecommendPage,
    MyCouponPage,
    MyMessagesPage,
    MyMessagesContentPage,
    SettingsPage,
    AddEditAddressPage,
    ProvincesPage,
    CitiesPage,
    AreasPage,
    UserIdentificationPage,
    UserIdentShopPage,
    NickNamePage,
    SelectAddressPage
  ],
  providers: [Storage]
})
export class AppModule {}
