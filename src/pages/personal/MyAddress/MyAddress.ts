import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage'
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, LoadingController, AlertController, NavParams, ToastController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";
import {AddEditAddressPage} from "./AddEditAddress";

@Component({
  selector: 'page-my-address',
  templateUrl: 'MyAddress.html',
  providers: [CommonServices]
})

export class MyAddressPage {
  public addresses: any = [];
  private userId: string;

  constructor (public navCtrl: NavController, public params: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private storage: Storage, private commonService: CommonServices) {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.userId = userInfo.id;
        let loading = this.commonService.showLoading(this.loadingCtrl);
        let params = new URLSearchParams();
        params.set('userId', this.userId);

        this.http.get(Keys.SERVICE_URL + '/userAddr/findUserAddrByUserId', {search: params}).subscribe((res) => {
          this.addresses = res.json().data;
          loading.dismiss();
        });
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   * 删除地址
   * @param addressId
   */
  delAddress (addressId: string) {
    this.commonService.showConfirm('确认删除该地址?', this.alertCtrl, (callback) => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('idStr', addressId);

        this.http.post(Keys.SERVICE_URL + '/userAddr/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          if (res.json().success == 'true') {
            this.commonService.showToastByHtml(this.toastCtrl, '删除成功');
          } else {
            this.commonService.showToastByHtml(this.toastCtrl, '删除失败');
          }
        });
      }
    });
  }

  /**
   * 新增收货地址
   * @param addressId
   */
  addEdit (addressId: string) {
    this.navCtrl.push(AddEditAddressPage, {addressId: addressId, userId: this.userId});
  }
}
