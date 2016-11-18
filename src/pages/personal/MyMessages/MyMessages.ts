import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage';
import {CommonServices} from "../../../commons/services/CommonServices";
import {NavController, LoadingController, AlertController, ToastController} from "ionic-angular";
import {Keys} from "../../../commons/constants/Keys";
import {MyMessagesContentPage} from "./MyMessagesContent";

@Component({
  selector: 'page-my-messages',
  templateUrl: 'MyMessages.html',
  providers: [CommonServices]
})

export class MyMessagesPage {
  public messages: any = [];

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let loading = this.commonService.showLoading(this.loadingCtrl);
        let params = new URLSearchParams();
        params.set('user.id', userInfo.id);

        this.http.get(Keys.SERVICE_URL + '/userMsg/findAllUserMsg', {search: params}).subscribe((res) => {
          this.messages = res.json();
          loading.dismiss();
        });
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   *
   * @param messageId
   */
  delMessage (messageId: string) {
    this.commonService.showConfirm('确认删除此消息?', this.alertCtrl, (callback) => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('idStr', messageId);

        this.http.post(Keys.SERVICE_URL + '/userMsg/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          if (res.json().success == 'true') {
            this.commonService.showToastByHtml(this.toastCtrl, '删除成功');
          } else {
            this.commonService.showToastByHtml(this.toastCtrl, '删除失败');
          }
        });
      }
    });
  }

  /**
   *
   * @param msgContent
   */
  messageDetail (msgContent: string) {
    this.navCtrl.push(MyMessagesContentPage, {messageContent: msgContent});
  }
}
