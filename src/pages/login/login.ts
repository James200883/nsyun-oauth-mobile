import {Component} from "@angular/core";
import {Storage} from '@ionic/storage';
import {ViewController, LoadingController, ToastController, NavController} from "ionic-angular";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {ForgotPassPage} from "../forgotPass/forgotPass";
import {RegisterPage} from "../register/register";
import {Keyboard} from "ionic-native";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public loginForm: FormGroup;
  public mobile: AbstractControl;
  public password: AbstractControl;

  constructor (private viewCtrl: ViewController, private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private formBuilder: FormBuilder, private http: Http, private storage: Storage, private dialogsService: DialogsServices) {
    this.loginForm = formBuilder.group({
      mobile: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.mobile = this.loginForm.controls['mobile'];
    this.password = this.loginForm.controls['password'];
  }

  //用户登陆
  public userLogin (userInfo) {
    if (this.loginForm.valid) {
      let params = new URLSearchParams();
      params.set('username', userInfo.controls.mobile.value);
      params.set('password', userInfo.controls.password.value);

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/user/userLogin', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '001') {
          this.dialogsService.showToast('请输入手机号码和登录密码', this.toastCtrl);
        }
        if (result.code == '002') {
          this.dialogsService.showToast('用户不存在', this.toastCtrl);
        }
        if (result.code == '003') {
          this.storage.set(Keys.USER_INFO_KEY, result.data);
          this.viewCtrl.dismiss();
        }
        if (result.code == '004') {
          this.dialogsService.showToast('手机号码或密码不正确', this.toastCtrl);
        }
      });
    }
  }

  //忘记密码
  public forgetPass () {
    Keyboard.close();
    this.navCtrl.push(ForgotPassPage);
  }

  //用户注册
  public register () {
    Keyboard.close();
    this.navCtrl.push(RegisterPage);
  }

  //关闭模态窗口
  public closeModal () {
    Keyboard.close();
    this.viewCtrl.dismiss();
  }

  //清空输入框
  public clearInput (_form: FormGroup, index: string) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true
  }
}
