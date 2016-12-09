import {Component} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {Storage} from '@ionic/storage';
import {NavController, LoadingController, ToastController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  public registerForm: FormGroup;
  public mobile: AbstractControl;
  public codes: AbstractControl;
  public password: AbstractControl;
  public insMobile: AbstractControl;
  public btnCode: string = '获取短信验证码';
  public isBtnCode: boolean = false;

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private storage: Storage, private http: Http, private formBuilder: FormBuilder, private dialogsService: DialogsServices) {
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

  //提交注册信息
  public userRegister (registerInfo: any) {
    if (this.registerForm.valid) {
      let params = new URLSearchParams();
      params.set('username', registerInfo.controls.mobile.value);
      params.set('mobile', registerInfo.controls.mobile.value);
      params.set('password', registerInfo.controls.password.value);
      params.set('msgCode', registerInfo.controls.codes.value);
      params.set('referralsMobile', registerInfo.controls.insMobile.value);

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/register/registerUser', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '200') {
          this.dialogsService.showToast('注册成功', this.toastCtrl);
          this.storage.set(Keys.USER_INFO_KEY, result.data);
          this.navCtrl.setRoot(HomePage);
        }
        if (result.code == '201') {
          this.dialogsService.showToast('该手机号已注册或绑定', this.toastCtrl);
        }
        if (result.code == '202') {
          this.dialogsService.showToast('服务器或网络异常, 请稍后再试', this.toastCtrl);
        }
        if (result.code == '203') {
          this.dialogsService.showToast('验证码已过期', this.toastCtrl);
        }
        if (result.code == '204') {
          this.dialogsService.showToast('然而验证码并不正确', this.toastCtrl);
        }
      });
    }
  }

  //获取验证码
  public getCodes (mobile: string) {
    let params = new URLSearchParams();
    params.set('mobile', mobile);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/register/getMessageCode', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      loading.dismiss();
      let result = res.json();
      if (result.code == '200') {
        this.dialogsService.showToast('已发送', this.toastCtrl);
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
        this.dialogsService.showToast('该手机号已注册或绑定', this.toastCtrl);
      }
      if (result.code == '202') {
        this.dialogsService.showToast('服务器或网络异常, 请稍后再试', this.toastCtrl);
      }
    });
  }

  //清空输入框内容
  public clearInput (_form, index) {
    _form.controls[index].setValue('');
    _form.controls[index]['_pristine'] = true;
  }
}
