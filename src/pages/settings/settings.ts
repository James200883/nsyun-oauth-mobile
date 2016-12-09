import {Component} from "@angular/core";
import {Storage} from '@ionic/storage';
import {
  NavController, NavParams, LoadingController, AlertController, ToastController,
  ActionSheetController
} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {Camera, Transfer} from "ionic-native";
import {NickNamePage} from "./nickName";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  private userId: string;
  public userInfo: any;
  public userSex: number = 3;
  public imageUrl: string;

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private navParams: NavParams, private http: Http, private storage: Storage, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

   let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/member/userIndex', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      let result = res.json().result;
      this.userInfo = result;
      this.imageUrl = result.imageUrl;
      this.userSex = result.sex;
      loading.dismiss();
    });
  }

  //修改昵称
  public updateName () {
    this.navCtrl.push(NickNamePage, {userId: this.userId, nickname: this.userInfo.realname});
  }

  //修改用户头像
  public updateHeadImage () {
    let actionSheet = this.actionSheetCtrl.create({
      title: '头像',
      buttons: [
        {
          text: '从相册选择',
          handler: () => {
            this.takePicture(0);
          }
        },{
          text: '拍照',
          handler: () => {
            this.takePicture(1);
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  //修改性别
  public updateSex () {
    let actionSheet = this.actionSheetCtrl.create({
      title: '性别',
      buttons: [
        {
          text: '男',
          handler: () => {
            this._updateSex(1);
          }
        },{
          text: '女',
          handler: () => {
            this._updateSex(2);
          }
        },
        {
          text: '保密',
          handler: () => {
            this._updateSex(3);
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  //退出登录
  public logout () {
    this.dialogsService.showConfirm('确定退出?', this.alertCtrl, callback => {
      if (callback) {
        this.storage.remove(Keys.USER_INFO_KEY);
        this.navCtrl.pop();
      }
    });
  }

  //获取照片
  private takePicture (type: number) {
    Camera.getPicture({
      destinationType: 1,
      sourceType: type,
      allowEdit: true,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      let options = {
        fileKey: 'file',
        fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
        params: {userId: this.userInfo.id}
      };

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      const fileTransfer = new Transfer();
      fileTransfer.upload(imageData, encodeURI(Keys.SERVICE_URL + '/member/modifyUserHeader'), options).then((res) => {
        let result = JSON.parse(res.response).data;
        this.imageUrl = result.imageUrl;
        this.storage.set(Keys.USER_INFO_KEY, result);
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
        this.dialogsService.showToast('操作失败', this.toastCtrl);
      });
    });
  }

  //修改性别
  private _updateSex (sex: number) {
    let params = new URLSearchParams();
    params.set('id', this.userInfo.id);
    params.set('sex', sex.toString());

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.post(Keys.SERVICE_URL + '/member/modifyUserInfo', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      this.userSex = sex;
      this.storage.set(Keys.USER_INFO_KEY, res.json().data);
      loading.dismiss();
    });
  }
}
