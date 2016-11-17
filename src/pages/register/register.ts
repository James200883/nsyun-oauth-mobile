import { Component } from '@angular/core'
import { Storage } from '@ionic/storage';
import {ViewController, NavController, LoadingController, ToastController} from "ionic-angular";
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {CommonServices} from "../../commons/services/CommonServices";
import {Http, URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {PersonalPage} from "../personal/personal";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [CommonServices]
})

export class RegisterPage {
  registerForm: FormGroup;
  mobile: AbstractControl;
  codes: AbstractControl;
  password: AbstractControl;
  insMobile: AbstractControl;
  btnCode: string = '获取短信验证码';
  isBtnCode: boolean = false;

  constructor (private viewCtrl: ViewController, private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private http: Http, private storage: Storage, private formBuilder: FormBuilder, private commonService: CommonServices) {
    this.registerForm = formBuilder.group({
      'mobile': ['', Validators.compose([Validators.required, Validators.pattern('1[34578]\\d{9}')])],
      'codes': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])],
      'insMobile': ['', Validators.compose([Validators.nullValidator])]
    });

    this.mobile = this.registerForm.controls['mobile'];
    this.codes = this.registerForm.controls['codes'];
    this.password = this.registerForm.controls['password'];
    this.insMobile = this.registerForm.controls['insMobile'];
  }

  /**
   * 提交注册信息
   * @param registerInfo
   */
  userRegister (registerInfo) {
    if (this.registerForm.valid) {
      let loading = this.commonService.showLoading(this.loadingCtrl);
      let params = new URLSearchParams();
      params.set('username', registerInfo.controls.mobile.value);
      params.set('mobile', registerInfo.controls.mobile.value);
      params.set('password', registerInfo.controls.password.value);
      params.set('msgCode', registerInfo.controls.codes.value);
      params.set('referralsMobile', registerInfo.controls.insMobile.value);

      this.http.post(Keys.SERVICE_URL + '/register/registerUser', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '200') {
          this.commonService.showToastByHtml(this.toastCtrl, '注册成功');
          this.storage.set(Keys.USER_INFO_KEY, result.data);
          this.navCtrl.push(PersonalPage);
        }
        if (result.code == '201') {
          this.commonService.showToastByHtml(this.toastCtrl, '该手机号已注册或绑定');
        }
        if (result.code == '202') {
          this.commonService.showToastByHtml(this.toastCtrl, '服务器或网络异常, 请稍后再试');
        }
        if (result.code == '203') {
          this.commonService.showToastByHtml(this.toastCtrl, '验证码已过期');
        }
        if (result.code == '204') {
          this.commonService.showToastByHtml(this.toastCtrl, '然而验证码并不正确');
        }
      });
    }
  }

  /**
   * 获取短信验证码
   * @param mobile
   */
  getCodes (mobile) {
    let params = new URLSearchParams();
    params.set('mobile', mobile);

    this.http.post(Keys.USER_INFO_KEY + '/register/getMessageCode', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let result = res.json();
      if (result.code == '200') {
        this.commonService.showToastByHtml(this.toastCtrl, '已发送');
        let count = 60, timer = null;
        timer = setInterval(() => {
          if (count == 0) {
            clearInterval(timer);
            timer = null;
            count = 60;
            this.btnCode = '获取短信验证码';
            this.isBtnCode = false;
          } else {
            this.isBtnCode = true;
            this.btnCode = count + '重新发送';
            count--;
          }
        }, 1000);
      }
      if (result.code == '201') {
        this.commonService.showToastByHtml(this.toastCtrl, '该手机号已注册或绑定');
      }
      if (result.code == '202') {
        this.commonService.showToastByHtml(this.toastCtrl, '服务器或网络异常, 请稍后再试');
      }
    });
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }

  clearInput (_form, index) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true;
  }
}
