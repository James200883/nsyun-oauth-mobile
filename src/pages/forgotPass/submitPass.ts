import {Component} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {Storage} from '@ionic/storage';
import {NavController, LoadingController, ToastController, NavParams} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-submitPass',
  templateUrl: 'submitPass.html'
})

export class SubmitPassPage {
  private userPhone: string;
  public submitPassForm: FormGroup;
  public password: AbstractControl;
  public confirmPass: AbstractControl;

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private storage: Storage, private formBuilder: FormBuilder, private dialogsService: DialogsServices) {
    this.submitPassForm = formBuilder.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])],
      'confirmPass': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    }, {validator: this.passwordsMatch});

    this.password = this.submitPassForm.controls['password'];
    this.confirmPass = this.submitPassForm.controls['confirmPass'];
    this.userPhone = navParams.get('phone');
  }

  //提交重置密码请求
  public submitPass (_form) {
    if (this.submitPassForm.valid) {
      let params = new URLSearchParams();
      params.set('mobile', this.userPhone);
      params.set('password', _form.controls.password.value);

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/member/restPassword', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '201') {
          this.dialogsService.showToast('用户不存在', this.toastCtrl);
        }
        if (result.code == '200') {
          this.storage.remove(Keys.USER_INFO_KEY);
          this.storage.set(Keys.USER_INFO_KEY, result.data);
          this.dialogsService.showToast('密码重置成功', this.toastCtrl);
          this.navCtrl.setRoot(HomePage);
        }
      });
    }
  }

  //清空输入框的值
  public clearInput (_form, index) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true;
  }

  //校验两次密码输入的一致性
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
}
