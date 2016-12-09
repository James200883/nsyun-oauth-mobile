import {Component} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {NavController, ModalController, ToastController, NavParams, LoadingController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {ProvincesPage} from "../address/provinces";
import {CitiesPage} from "../address/cities";
import {AreaPage} from "../address/area";
import {CertShopPage} from "./certShop";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector: 'page-addMemberCert',
  templateUrl: 'addMemberCert.html'
})

export class AddMemberCertPage {
  private userId: string;
  public flag: string; //1 表示更新 0表示新增
  public memberCertForm: FormGroup;
  public addressCode: AbstractControl;
  public address: AbstractControl;
  public realName: AbstractControl;
  public identityNo: AbstractControl;
  public provinceName: string = '省';
  public citiesName: string = '市';
  public areaName: string = '区';
  public shopName: string = '认证网点';
  public cities: any = [];
  public areas: any = [];

  constructor (private navCtrl: NavController, private modalCtrl: ModalController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private formBuilder: FormBuilder, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
    this.flag = navParams.get('flag');
    if (this.flag == '1') {
      this.getCertInfoByUserId();
    }

    this.memberCertForm = formBuilder.group({
      'realName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      'identityNo': ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(20)])],
      'addressCode': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      'address': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(60)])]
    });

    this.realName = this.memberCertForm.controls['realName'];
    this.identityNo = this.memberCertForm.controls['identityNo'];
    this.addressCode = this.memberCertForm.controls['addressCode'];
    this.address = this.memberCertForm.controls['address'];
  }

  //新增认证信息
  public addMemberCert (memberCertInfo) {
    if (this.memberCertForm.valid) {
      if (this.provinceName == '省' || this.citiesName == '市' || this.areaName == '区') {
        this.dialogsService.showToast('请选择区域', this.toastCtrl);
        return;
      }
      if (this.shopName == '认证网点') {
        this.dialogsService.showToast('请选择认证网点', this.toastCtrl);
        return;
      }

      let params = new URLSearchParams();
      params.set('userId', this.userId);
      params.set('addressCode', memberCertInfo.controls.addressCode.value);
      params.set('address', memberCertInfo.controls.address.value);
      params.set('realName', memberCertInfo.controls.realName.value);
      params.set('identityCard', memberCertInfo.controls.identityNo.value);
      params.set('province', this.provinceName);
      params.set('city', this.citiesName);
      params.set('area', this.areaName);

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/userAccount/save', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        if (res.json().success == 'true') {
          this.dialogsService.showToast('操作成功', this.toastCtrl);
          this.navCtrl.pop();
        }
      });
    }
  }

  //选择省份
  public selectProvince () {
    let modal = this.modalCtrl.create(ProvincesPage);
    modal.onDidDismiss((data) => {
      if (data) {
        this.provinceName = data.provinceName;
        this.cities = data.cities;
        this.citiesName = '市';
        this.areaName = '区';
      }
    });
    modal.present();
  }

  //选择城市
  public selectCities () {
    let modal = this.modalCtrl.create(CitiesPage, {cities: this.cities});
    modal.onDidDismiss((data) => {
      if (data) {
        this.citiesName = data.citiesName;
        this.areas = data.areas;
        this.areaName = '区';
      }
    });
    modal.present();
  }

  //选择区域
  public selectArea () {
    let modal = this.modalCtrl.create(AreaPage, {areas: this.areas});
    modal.onDidDismiss((data) => {
      if (data) {
        this.areaName = data.areaName;
      }
    });
    modal.present();
  }

  //选择认证网点
  public selectCertShop (){
    if (this.provinceName && this.provinceName != '省' && this.citiesName && this.citiesName != '市' && this.areaName && this.areaName != '区') {
      let modal = this.modalCtrl.create(CertShopPage, {areaName: this.areaName, userId: this.userId});
      modal.onDidDismiss((data) => {
        if (data) {
          this.shopName = data.shopName;
        }
      });
      modal.present();
    } else {
      this.dialogsService.showToast('请选择区域', this.toastCtrl);
    }
  }

  //根据用户ID获取用户认证信息
  private getCertInfoByUserId () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/userAccount/findUserAccountByUserId', {search: params}).subscribe((res) => {
      let result = res.json();
      this.provinceName = result.province;
      this.citiesName = result.city;
      this.areaName = result.area;

      this.memberCertForm.controls['realName'].setValue(result.realName);
      this.memberCertForm.controls['identityNo'].setValue(result.identityCard);
      this.memberCertForm.controls['addressCode'].setValue(result.addressCode);
      this.memberCertForm.controls['address'].setValue(result.address);
      loading.dismiss();
    });
  }
}
