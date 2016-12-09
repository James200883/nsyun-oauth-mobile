import {Component} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {NavController, ToastController, LoadingController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {SubmitPassPage} from "./submitPass";
import {Keyboard} from "ionic-native";

@Component({
  selector: 'page-forgotPass',
  templateUrl: 'forgotPass.html'
})

export class ForgotPassPage {
  public forgotPassForm: FormGroup;
  public mobile: AbstractControl;
  public codes: AbstractControl;
  public btnCode: string = '获取短信验证码';
  public isBtnCode: boolean = false;

  constructor (private navCtrl: NavController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private http: Http, private formBuilder: FormBuilder, private dialogsService: DialogsServices) {
    this.forgotPassForm = formBuilder.group({
      'mobile': ['', Validators.compose([Validators.required, Validators.pattern('1[34578]\\d{9}')])],
      'codes': ['', Validators.compose([Validators.required])],
    });

    this.mobile = this.forgotPassForm.controls['mobile'];
    this.codes = this.forgotPassForm.controls['codes'];
  }

  //下一步
  public nextStep (_form) {
    Keyboard.close();
    if (this.forgotPassForm.valid) {
      let params = new URLSearchParams();
      params.set('mobile', _form.controls.mobile.value);
      params.set('codes', _form.controls.codes.value);

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/member/checkCodes', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        loading.dismiss();
        let result = res.json();
        if (result.code == '204') {
          this.dialogsService.showToast('短信验证码不正确', this.toastCtrl);
        }
        if (result.code == '203') {
          this.dialogsService.showToast('短信验证码已过期', this.toastCtrl);
        }
        if (result.code == '200') {
          this.navCtrl.push(SubmitPassPage, {phone: _form.controls.mobile.value});
        }
      });
    }
  }

  //发送验证码
  public getCodes (mobile: string) {
    let params = new URLSearchParams();
    params.set('mobile', mobile);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/member/getMessageCode', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
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
        this.dialogsService.showToast('用户不存在', this.toastCtrl);
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
