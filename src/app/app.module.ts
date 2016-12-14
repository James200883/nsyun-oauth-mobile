import { NgModule, ErrorHandler } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PersonalPage } from '../pages/personal/personal';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {SalesPage} from "../pages/sales/sales";
import {DialogsServices} from "../commons/services/DialogsServices";
import {CategoryPage} from "../pages/category/category";
import {ProductDetailsPage} from "../pages/productDetails/productDetails";
import {SkuItemsPage} from "../pages/skuItems/skuItems";
import {CartPage} from "../pages/cart/cart";
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {ForgotPassPage} from "../pages/forgotPass/forgotPass";
import {OrdersPage} from "../pages/orders/orders";
import {AddressPage} from "../pages/address/address";
import {AddEditAddressPage} from "../pages/address/AddEditAddress";
import {ProvincesPage} from "../pages/address/provinces";
import {CitiesPage} from "../pages/address/cities";
import {AreaPage} from "../pages/address/area";
import {CouponPage} from "../pages/coupon/coupon";
import {RecommendMemberPage} from "../pages/recommendMember/RecommendMember";
import {MessagesPage} from "../pages/message/message";
import {MessageContentPage} from "../pages/message/messageContent";
import {SettingsPage} from "../pages/settings/settings";
import {NickNamePage} from "../pages/settings/nickName";
import {AboutPage} from "../pages/about/about";
import {SalesServicePage} from "../pages/salesService/saleService";
import {MemberCertPage} from "../pages/memberCert/memberCert";
import {AddMemberCertPage} from "../pages/memberCert/addMemberCert";
import {CertShopPage} from "../pages/memberCert/certShop";
import {AddEditSaleServicesPage} from "../pages/salesService/addEditSaleServices";
import {CheckOutPage} from "../pages/checkout/checkout";
import {UserCartService} from "../commons/services/UserCartService";
import {SelectAddressPage} from "../pages/checkout/selectAddress";
import {PayResultPage} from "../pages/checkout/result";
import {SubmitPassPage} from "../pages/forgotPass/submitPass";
import {NewsPage} from "../pages/news/news";
import {NewsDetailPage} from "../pages/news/newsDetail";

@NgModule({
  declarations: [
    MyApp,
    SalesPage,
    PersonalPage,
    HomePage,
    TabsPage,
    CategoryPage,
    ProductDetailsPage,
    SkuItemsPage,
    CartPage,
    LoginPage,
    RegisterPage,
    ForgotPassPage,
    OrdersPage,
    AddressPage,
    AddEditAddressPage,
    ProvincesPage,
    CitiesPage,
    AreaPage,
    CouponPage,
    RecommendMemberPage,
    MessagesPage,
    MessageContentPage,
    SettingsPage,
    NickNamePage,
    AboutPage,
    SalesServicePage,
    MemberCertPage,
    AddMemberCertPage,
    CertShopPage,
    AddEditSaleServicesPage,
    CheckOutPage,
    SelectAddressPage,
    PayResultPage,
    SubmitPassPage,
    NewsPage,
    NewsDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      mode: 'ios',
      backButtonText: '',
      backButtonIcon: 'arrow-back',
      tabsPlacement: 'bottom'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SalesPage,
    PersonalPage,
    HomePage,
    TabsPage,
    CategoryPage,
    ProductDetailsPage,
    SkuItemsPage,
    CartPage,
    LoginPage,
    RegisterPage,
    ForgotPassPage,
    OrdersPage,
    AddressPage,
    AddEditAddressPage,
    ProvincesPage,
    CitiesPage,
    AreaPage,
    CouponPage,
    RecommendMemberPage,
    MessagesPage,
    MessageContentPage,
    SettingsPage,
    NickNamePage,
    AboutPage,
    SalesServicePage,
    MemberCertPage,
    AddMemberCertPage,
    CertShopPage,
    AddEditSaleServicesPage,
    CheckOutPage,
    SelectAddressPage,
    PayResultPage,
    SubmitPassPage,
    NewsPage,
    NewsDetailPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DialogsServices, Storage, UserCartService]
})
export class AppModule {}
