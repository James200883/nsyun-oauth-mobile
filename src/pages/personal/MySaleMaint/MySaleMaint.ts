import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage'
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, LoadingController, AlertController, NavParams, ToastController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";
import {AddSaleMaintPage} from "./AddSaleMaint";

@Component({
  selector: 'page-my-salemaint',
  templateUrl: 'MySaleMaint.html',
  providers: [CommonServices]
})

export class MySaleMaintPage {
  public saleMaintes: any = [];
  private userId: string;

  constructor (public navCtrl: NavController, public params: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private storage: Storage, private commonService: CommonServices) {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.userId = userInfo.id;
        this.loadData();
      }
    });
  }

  loadData()
  {
    let loading = this.commonService.showLoading(this.loadingCtrl);
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    this.http.get(Keys.SERVICE_URL + '/saleMaint/findByUserId', {search: params}).subscribe((res) => {
      this.saleMaintes = res.json();
      loading.dismiss();
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   * 删除地址
   * @param addressId
   */
  delSaleMaint (addressId: string) {
    this.commonService.showConfirm('确认删除售后服务?', this.alertCtrl, (callback) => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('idStr', addressId);

        this.http.post(Keys.SERVICE_URL + '/saleMaint/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          if (res.json().success == 'true') {
            this.commonService.showToastByHtml(this.toastCtrl, '删除成功');
            this.loadData();
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
  addEdit (curId: string) {
    this.navCtrl.push(AddSaleMaintPage, {saleMaintId: curId, userId: this.userId});
  }
}
