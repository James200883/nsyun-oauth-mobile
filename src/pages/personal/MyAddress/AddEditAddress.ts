import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {NavController, LoadingController, ModalController, NavParams, ToastController} from "ionic-angular";
import {CommonServices} from "../../../commons/services/CommonServices";
import {ProvincesPage} from "./provinces";
import {CitiesPage} from "./cities";
import {AreasPage} from "./areas";
import {Keys} from "../../../commons/constants/Keys";
import {MyAddressPage} from "./MyAddress";

@Component({
  selector: 'page-add-edit-address',
  templateUrl: 'AddEditAddress.html',
  providers: [CommonServices]
})

export class AddEditAddressPage {
  private addressId: string;
  private userId: string;

  addressForm: FormGroup;
  contactUserName: AbstractControl;
  contractTel: AbstractControl;
  addressCode: AbstractControl;
  address: AbstractControl;

  provinceName: string = '省';
  citiesName: string = '市';
  areaName: string = '区';

  cities = [];
  areas = [];

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, private http: Http, private formBuilder: FormBuilder, private navParams: NavParams, private commonService: CommonServices) {
    this.addressId = navParams.get('addressId');
    this.userId = navParams.get('userId');
    if (this.addressId) {
      this.getAddressById(this.addressId);
    }

    this.addressForm = formBuilder.group({
      'contactUserName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      'contractTel': ['', Validators.compose([Validators.required, Validators.pattern('1[34578]\\d{9}')])],
      'addressCode': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      'address': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(60)])]
    });

    this.contactUserName = this.addressForm.controls['contactUserName'];
    this.contractTel = this.addressForm.controls['contractTel'];
    this.addressCode = this.addressForm.controls['addressCode'];
    this.address = this.addressForm.controls['address'];
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   *编辑或新增用户地址
   * @param addressInfo
   */
  addEditAddress (addressInfo) {
    if (this.addressForm.valid) {
      if (this.provinceName == '省' || this.citiesName == '市' || this.areaName == '区') {
        this.commonService.showToastByHtml(this.toastCtrl, '请选择区域');
        return;
      }

      let params = new URLSearchParams();
      params.set('userId', this.userId);
      params.set('id', this.addressId);
      params.set('contactUserName', addressInfo.controls.contactUserName.value);
      params.set('contractTel', addressInfo.controls.contractTel.value);
      params.set('addressCode', addressInfo.controls.addressCode.value);
      params.set('address', addressInfo.controls.address.value);
      params.set('province', this.provinceName);
      params.set('city', this.citiesName);
      params.set('area', this.areaName);

      let loading = this.commonService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/userAddr/save', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        if (res.json().success == 'true') {
          loading.dismiss();
          this.commonService.showToastByHtml(this.toastCtrl, '保存成功');
          this.navCtrl.push(MyAddressPage);
        }
      });
    }
  }

  /**
   * 根据ID获取地址信息
   * @param addressId
   */
  getAddressById (addressId: string) {
    let params = new URLSearchParams();
    params.set('id', addressId);
    this.http.post(Keys.SERVICE_URL + '/userAddr/findUserAddrById', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let result = res.json();
      this.provinceName = result.province;
      this.citiesName = result.city;
      this.areaName = result.area;

      this.addressForm.controls['contactUserName'].setValue(result.contactUserName);
      this.addressForm.controls['contractTel'].setValue(result.contractTel);
      this.addressForm.controls['addressCode'].setValue(result.addressCode);
      this.addressForm.controls['address'].setValue(result.address);
    });
  }

  /**
   * 选择省/直辖市
   */
  selectProvince () {
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

  /**
   * 选择城市
   */
  selectCities () {
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

  /**
   * 选择区域
   */
  selectArea () {
    let modal = this.modalCtrl.create(AreasPage, {areas: this.areas});
    modal.onDidDismiss((data) => {
      if (data) {
        this.areaName = data.areaName;
      }
    });
    modal.present();
  }

  clearInput (_form, index) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true;
  }
}
