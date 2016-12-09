import {Component} from "@angular/core";
import {NavParams, LoadingController, AlertController, ToastController, NavController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {MessageContentPage} from "./messageContent";

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})

export class MessagesPage {
  private userId: string;
  public messages: any = [];

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private navParams: NavParams,private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('user.id', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/userMsg/findAllUserMsg', {search: params}).subscribe((res) => {
      this.messages = res.json();
      loading.dismiss();
    });
  }

  //删除消息
  public delMessage (messageId: string) {
    this.dialogsService.showConfirm('确认删除此消息?', this.alertCtrl, callback => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('idStr', messageId);

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/userMsg/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          loading.dismiss();
          if (res.json().success == 'true') {
            this.dialogsService.showToast('删除成功', this.toastCtrl);
          } else {
            this.dialogsService.showToast('删除失败', this.toastCtrl);
          }
        });
      }
    });
  }

  //查看消息详情
  public messageDetail (msgContent: string) {
    this.navCtrl.push(MessageContentPage, {messageContent: msgContent});
  }
}
