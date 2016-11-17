import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import { Storage } from '@ionic/storage';
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, LoadingController, NavParams, ToastController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";

@Component({
  selector: 'page-settings-nickName',
  templateUrl: 'nickName.html',
  providers: [CommonServices]
})

export class NickNamePage {
  userId: string;
  nickName: string;

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private http: Http, private storage: Storage, private navParams: NavParams, private commonService: CommonServices) {
    this.userId = navParams.get('userId');
    this.nickName = navParams.get('nickname');
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  saveNickname () {
    if (this.nickName.length < 2 || this.nickName.length > 10) {
      this.commonService.showToastByHtml(this.toastCtrl, '昵称:2-10个字符限制');
      return;
    }

    let params = new URLSearchParams();
    params.set('id', this.userId);
    params.set('realname', this.nickName);

    let loading = this.commonService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/member/modifyUserInfo', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      if (res.json().status == 'true') {
        this.storage.set(Keys.USER_INFO_KEY, res.json().data);
        loading.dismiss();
        this.navCtrl.pop();
      }
    });
  }
}
