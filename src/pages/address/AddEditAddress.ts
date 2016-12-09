import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {NavParams, LoadingController, ToastController, NavController, ModalController} from "ionic-angular";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {ProvincesPage} from "./provinces";
import {CitiesPage} from "./cities";
import {AreaPage} from "./area";

@Component({
  selector: 'page-addEditAddress',
  templateUrl: 'AddEditAddress.html'
})

export class AddEditAddressPage {
  private addressId: string;
  private userId: string;

  public addressForm: FormGroup;
  public contactUserName: AbstractControl;
  public contractTel: AbstractControl;
  public addressCode: AbstractControl;
  public address: AbstractControl;
  public provinceName: string = '省';
  public citiesName: string = '市';
  public areaName: string = '区';
  public cities: any = [];
  public areas: any = [];

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private modalCtrl: ModalController, private navParams: NavParams, private http: Http, private formBuilder: FormBuilder, private dialogsService: DialogsServices) {
    this.addressId = navParams.get('addressId');
    this.userId = navParams.get('userId');
    if (this.addressId) {
      this.getAddressById(this.addressId);
    }
    if (!this.addressId) {
      this.addressId = '0';
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

  //编辑或新增用户地址
  public addEditAddress (addressInfo) {
    if (this.addressForm.valid) {
      if (this.provinceName == '省' || this.citiesName == '市' || this.areaName == '区') {
        this.dialogsService.showToast('请选择区域', this.toastCtrl);
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

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/userAddr/save', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        if (res.json().success == 'true') {
          loading.dismiss();
          this.dialogsService.showToast('保存成功', this.toastCtrl);
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

  //根据地址ID获取地址信息
  private getAddressById (addressId: string) {
    let params = new URLSearchParams();
    params.set('id', addressId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/userAddr/findUserAddrById', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let result = res.json();
      this.provinceName = result.province;
      this.citiesName = result.city;
      this.areaName = result.area;

      this.addressForm.controls['contactUserName'].setValue(result.contactUserName);
      this.addressForm.controls['contractTel'].setValue(result.contractTel);
      this.addressForm.controls['addressCode'].setValue(result.addressCode);
      this.addressForm.controls['address'].setValue(result.address);
      loading.dismiss();
    });
  }
}
