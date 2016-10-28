import {Component} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Storage } from '@ionic/storage';
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {CommonServices} from "../../commons/services/CommonServices";
import {Keys} from "../../commons/constants/Keys";
import {PersonalPage} from "../personal/personal";

@Component({
  selector: 'page-submitPass',
  templateUrl: 'submitPass.html',
  providers: [CommonServices]
})

export class SubmitPassPage {
  userPhone: string;
  submitPassForm: FormGroup;
  password: AbstractControl;
  confirmPass: AbstractControl;

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private storage: Storage, private formBuilder: FormBuilder, private commonService: CommonServices) {
    this.submitPassForm = formBuilder.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])],
      'confirmPass': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    }, {validator: this.passwordsMatch});

    this.userPhone = navParams.get('phone');
    this.password = this.submitPassForm.controls['password'];
    this.confirmPass = this.submitPassForm.controls['confirmPass'];
  }

  /**
   *
   * @param _form
   */
  submitPass (_form) {
    if (this.submitPassForm.valid) {
      let loading = this.commonService.showLoading(this.loadingCtrl);
      let params = new URLSearchParams();
      params.set('mobile', this.userPhone);
      params.set('password', _form.controls.password.value);

      this.http.post(Keys.SERVICE_URL + '/member/restPassword', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '201') {
          this.commonService.showToast('用户不存在', 'center');
        }
        if (result.code == '200') {
          this.commonService.showToast('密码重置成功', 'center');
          this.storage.remove(Keys.USER_INFO_KEY);
          this.storage.set(Keys.USER_INFO_KEY, result.data);
          this.navCtrl.push(PersonalPage);
        }
      });
    }
  }

  /**
   * 校验两次密码输入的一致性
   * @param cg
   * @returns {null}
   */
  private passwordsMatch (fg: FormGroup) {
    let password = fg.controls['password'];
    let confirmPass = fg.controls['confirmPass'];
    let result = null;
    if ((password.touched || confirmPass.touched) && (password.value !== confirmPass.value)) {
      result = {error: 'Passwords do not match'};
      confirmPass.setErrors({passwordMismatch: true})
    }
    return result;
  }

  clearInput (_form, index) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true;
  }
}
