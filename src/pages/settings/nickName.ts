import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Storage} from '@ionic/storage';
import {NavController, NavParams, LoadingController, ToastController} from "ionic-angular";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector: 'page-nickname',
  templateUrl: 'nickName.html'
})

export class NickNamePage {
  private userId: string;
  public nickName: string;

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private storage: Storage, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
    this.nickName = navParams.get('nickname');
  }

  //修改昵称
  public saveNickname () {
    if (this.nickName.length < 2 || this.nickName.length > 10) {
      this.dialogsService.showToast('昵称:2-10个字符限制', this.toastCtrl);
      return;
    }

    let params = new URLSearchParams();
    params.set('id', this.userId);
    params.set('realname', this.nickName);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/member/modifyUserInfo', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      if (res.json().status == 'true') {
        this.storage.set(Keys.USER_INFO_KEY, res.json().data);
        loading.dismiss();
        this.navCtrl.pop();
      }
    });
  }
}
