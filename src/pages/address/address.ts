import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {NavParams, LoadingController, AlertController, ToastController, NavController} from "ionic-angular";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {AddEditAddressPage} from "./AddEditAddress";

@Component({
  selector: 'page-address',
  templateUrl: 'address.html'
})

export class AddressPage {
  private userId: string;
  public addresses: any = [];

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  //页面载入完成加载数据
  ionViewDidEnter () {
    this.loadUserAddress();
  }

  //删除地址
  public delAddress (addressId: string) {
    this.dialogsService.showConfirm('确认删除该地址?', this.alertCtrl, callback => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('idStr', addressId);

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/userAddr/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          loading.dismiss();
          if (res.json().success == 'true') {
            this.dialogsService.showToast('删除成功', this.toastCtrl);
          } else {
            this.dialogsService.showToast('删除失败', this.toastCtrl);
          }
          this.loadUserAddress();
        });
      }
    });
  }

  //编辑或新增收货地址
  public addEdit (addressId: string) {
    this.navCtrl.push(AddEditAddressPage, {addressId: addressId, userId: this.userId});
  }

  //加载用户收货地址
  private loadUserAddress () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/userAddr/findUserAddrByUserId', {search: params}).subscribe((res) => {
      this.addresses = res.json().data;
      loading.dismiss();
    });
  }
}
