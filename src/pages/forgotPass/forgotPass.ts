import { Component } from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {ViewController, NavController, ToastController} from "ionic-angular";
import {Keys} from "../../commons/constants/Keys";
import {CommonServices} from "../../commons/services/CommonServices";
import {SubmitPassPage} from "./submitPass";

@Component({
  selector: 'page-forgotPass',
  templateUrl: 'forgotPass.html',
  providers: [CommonServices]
})

export class ForgotPassPage {
  forgotPassForm: FormGroup;
  mobile: AbstractControl;
  codes: AbstractControl;
  btnCode: string = '获取短信验证码';
  isBtnCode: boolean = false;

  constructor (private viewCtrl: ViewController, private navCtrl: NavController, private toastCtrl: ToastController, private http: Http, private formBuilder: FormBuilder, private commonService: CommonServices) {
    this.forgotPassForm = formBuilder.group({
      'mobile': ['', Validators.compose([Validators.required, Validators.pattern('1[34578]\\d{9}')])],
      'codes': ['', Validators.compose([Validators.required])],
    });
    this.mobile = this.forgotPassForm.controls['mobile'];
    this.codes = this.forgotPassForm.controls['codes'];
  }

  /**
   *
   * @param _form
   */
  nextStep (_form) {
    if (this.forgotPassForm.valid) {
      let params = new URLSearchParams();
      params.set('mobile', _form.controls.mobile.value);
      params.set('codes', _form.controls.codes.value);

      this.navCtrl.push(SubmitPassPage, {phone: _form.controls.mobile.value});
      /*this.http.post(Keys.SERVICE_URL + '/member/checkCodes', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        let result = res.json();
        if (result.code == '204') {
          this.commonService.showToast('短信验证码不正确', 'center');
        }
        if (result.code == '203') {
          this.commonService.showToast('短信验证码已过期', 'center');
        }
        if (result.code == '200') {
          this.navCtrl.push(SubmitPassPage, {phone: _form.controls.mobile.value});
        }
      });*/
    }
  }

  /**
   *
   * @param mobile
   */
  getCodes (mobile) {
    let params = new URLSearchParams();
    params.set('mobile', mobile);

    this.http.post(Keys.SERVICE_URL + '/member/getMessageCode', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
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
        this.commonService.showToastByHtml(this.toastCtrl, '用户不存在');
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
