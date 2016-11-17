/**
 * Created by hevan on 2016/10/17.
 */

import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage'
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {
  NavController, LoadingController, ModalController, AlertController, NavParams,
  ToastController
} from "ionic-angular";
import {CommonServices} from "../../../commons/services/CommonServices";
import {ProvincesPage} from "../MyAddress/provinces";
import {CitiesPage} from "../MyAddress/cities";
import {AreasPage} from "../MyAddress/areas";
import {Keys} from "../../../commons/constants/Keys";
import {UserIdentShopPage} from "./UserIdentShop";

@Component({
  selector: 'page-user-indentification',
  templateUrl: 'UserIdentification.html',
  providers: [CommonServices]
})

export class UserIdentificationPage {
  private userId: string;
  addressForm: FormGroup;
  addressCode: AbstractControl;
  address: AbstractControl;
  realName: AbstractControl;
  identityCard: AbstractControl;

  provinceName: string = '省';
  citiesName: string = '市';
  areaName: string = '区';
  tradeInfo:string = '';

  cities = [];
  areas = [];

  constructor (public navCtrl: NavController,private alerCtrl:AlertController, private toastCtrl: ToastController, private storage:Storage,private loadingCtrl: LoadingController, private modalCtrl: ModalController, private http: Http, private formBuilder: FormBuilder, private navParams: NavParams, private commonService: CommonServices) {

    this.addressForm = formBuilder.group({
      'realName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      'identityCard': ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(20)])],
      'addressCode': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      'address': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(60)])]
    });

    this.realName = this.addressForm.controls['realName'];
    this.identityCard = this.addressForm.controls['identityCard'];
    this.addressCode = this.addressForm.controls['addressCode'];
    this.address = this.addressForm.controls['address'];
    this.tradeInfo = '';


    this.loadData();

  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'flex';
  }

  loadData(){
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        this.userId = userInfo.id;
        let loading = this.commonService.showLoading(this.loadingCtrl);
        let params = new URLSearchParams();

        console.log(this.userId);
        params.set('userId', this.userId);

        this.http.get(Keys.SERVICE_URL + '/userAccount/findUserAccountByUserId',{search: params}).subscribe((res) => {
          let result = res.json();
          console.log(result);
          this.provinceName = result.province;
          this.citiesName = result.city;
          this.areaName = result.area;

          this.addressForm.controls['realName'].setValue(result.realName);
          this.addressForm.controls['identityCard'].setValue(result.identityCard);
          this.addressForm.controls['addressCode'].setValue(result.addressCode);
          this.addressForm.controls['address'].setValue(result.address);

          loading.dismiss();
        });

        this.http.get(Keys.SERVICE_URL + '/tradeUser/findTradeUserByUserId',  {search: params}).subscribe((res) => {
          let tradeUser = res.json();
          if(null != tradeUser && null != tradeUser.shop){
            this.tradeInfo = tradeUser.shop.name;
          }else if(null != tradeUser &&  null != tradeUser.corp){
            this.tradeInfo = tradeUser.corp.name;
          }
        });

      }
    });
  }

  ionViewDidEnter(){


    let params = new URLSearchParams();
    params.set('userId', this.userId);

    this.http.get(Keys.SERVICE_URL + '/tradeUser/findTradeUserByUserId',  {search: params}).subscribe((res) => {
      let tradeUser = res.json();
      if(null != tradeUser && null != tradeUser.shop){
        this.tradeInfo = tradeUser.shop.shopName;
      }else if(null != tradeUser &&  null != tradeUser.corp){
        this.tradeInfo = tradeUser.corp.name;
      }
    });
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

      if(this.provinceName == '河北' && this.tradeInfo.length < 2){
        this.commonService.showToastByHtml(this.toastCtrl, '河北省请认证网点');
        return;
      }

      let params = new URLSearchParams();
      params.set('userId', this.userId);
      params.set('addressCode', addressInfo.controls.addressCode.value);
      params.set('address', addressInfo.controls.address.value);
      params.set('realName', addressInfo.controls.realName.value);
      params.set('identityCard', addressInfo.controls.identityCard.value);
      params.set('province', this.provinceName);
      params.set('city', this.citiesName);
      params.set('area', this.areaName);

      let loading = this.commonService.showLoading(this.loadingCtrl);

      this.http.post(Keys.SERVICE_URL + '/userAccount/save', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        let result = res.json();
        console.log(result);

        loading.dismiss();

        this.navCtrl.pop();
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

  goTradeUser(){
    if(null != this.areaName && this.areaName.length > 2){
      this.navCtrl.push(UserIdentShopPage,{'areaName':this.areaName, 'cityName':this.citiesName})
    }else{
      //this.commonService.showToast('请选择区域', 'center');
      return;
    }
  }

  clearInput (_form, index) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true;
  }
}

