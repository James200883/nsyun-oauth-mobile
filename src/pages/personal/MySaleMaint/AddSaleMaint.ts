import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {NavController, LoadingController, ModalController, NavParams, ToastController} from "ionic-angular";
import {CommonServices} from "../../../commons/services/CommonServices";
import {Keys} from "../../../commons/constants/Keys";
import {MySaleMaintPage} from "./MySaleMaint";

@Component({
  selector: 'page-add-edit-salemaint',
  templateUrl: 'AddSaleMaint.html',
  providers: [CommonServices]
})

export class AddSaleMaintPage {
  private saleMaintId: string;
  private userId: string;
  private saleMaint:any = {'type':'','address':'','info':''};


  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, private http: Http, private formBuilder: FormBuilder, private navParams: NavParams, private commonService: CommonServices) {
    this.saleMaintId = navParams.get('saleMaintId');
    this.userId = navParams.get('userId');
    if (this.saleMaintId) {
      this.getSaleMaint(this.saleMaintId);
    }
    if (!this.saleMaintId) {
      this.saleMaintId = '0';
    }

  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   *编辑或新增用户地址
   * @param addressInfo
   */
  addSaleMaint () {
    console.log(this.saleMaintId);

      let params = new URLSearchParams();
      params.set('user.id', this.userId);
      params.set('id', this.saleMaintId);

      params.set('address', this.saleMaint.address);
      params.set('info', this.saleMaint.info);
      params.set('type', this.saleMaint.type);

      let loading = this.commonService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/saleMaint/save', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        if (res.json().success == 'true') {
          loading.dismiss();
          this.commonService.showToastByHtml(this.toastCtrl, '保存成功');
          this.navCtrl.push(MySaleMaintPage);
        }
      });

  }

  /**
   * 根据ID获取地址信息
   * @param addressId
   */
  getSaleMaint (saleMaintId: string) {
    let params = new URLSearchParams();
    params.set('id', saleMaintId);
    this.http.get(Keys.SERVICE_URL + '/saleMaint/findById', {search: params}).subscribe((res) => {
      let result = res.json();
      this.saleMaint.address = result.address;
      this.saleMaint.info = result.info;
      this.saleMaint.type = result.type;

    });
  }

}
