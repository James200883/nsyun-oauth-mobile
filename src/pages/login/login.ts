import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {CommonServices} from "../../commons/services/CommonServices";
import {NavController, LoadingController, ModalController, ToastController} from "ionic-angular";
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {Http, URLSearchParams} from "@angular/http";
import {PersonalPage} from "../personal/personal";
import {Keys} from "../../commons/constants/Keys";
import {RegisterPage} from "../register/register";
import {ForgotPassPage} from "../forgotPass/forgotPass";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [CommonServices]
})

export class LoginPage {
  loginForm: FormGroup;
  mobile: AbstractControl;
  password: AbstractControl;

  constructor (private navCtrl: NavController, private toastCtrl: ToastController, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private http: Http, private storage: Storage, private commonService: CommonServices) {
    this.loginForm = this.formBuilder.group({
      mobile: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.mobile = this.loginForm.controls['mobile'];
    this.password = this.loginForm.controls['password'];
  }

  /**
   * user login
   * @param user
   */
  userLogin (user) {
    if (this.loginForm.valid) {
      let loading = this.commonService.showLoading(this.loadingCtrl);
      let params = new URLSearchParams();
      params.set('username', user.controls.mobile.value);
      params.set('password', user.controls.password.value);

      this.http.post(Keys.SERVICE_URL + '/user/userLogin', {headers: Keys.HEADERS}, {search: params}).subscribe(res => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '001') {
          this.commonService.showToastByHtml(this.toastCtrl, '请输入手机号码和登录密码');
        }
        if (result.code == '002') {
          this.commonService.showToastByHtml(this.toastCtrl, '用户不存在');
        }
        if (result.code == '003') {
          this.storage.set(Keys.USER_INFO_KEY, result.data);
          this.navCtrl.push(PersonalPage);
        }
        if (result.code == '004') {
          this.commonService.showToastByHtml(this.toastCtrl, '手机号码或密码不正确');
        }
      });
    }
  }

  presentRegister () { //注册modal
    let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
  }

  presentForgotPass () { //忘记密码modal
    let modal = this.modalCtrl.create(ForgotPassPage);
    modal.present();
  }

  clearInput (_form, index): void {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true
  }
}
