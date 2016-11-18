import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Storage} from '@ionic/storage';
import {NavController, LoadingController, AlertController, ActionSheetController} from "ionic-angular";
import {CommonServices} from "../../../commons/services/CommonServices";
import {Keys} from "../../../commons/constants/Keys";
import {NickNamePage} from "./nickName";
import {Camera, Transfer} from "ionic-native";
import {PersonalPage} from "../personal";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [CommonServices]
})

export class SettingsPage {
  public userInfo: any;
  public userSex: number = 3;
  public imageUrl: string;

  constructor (public navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController, private storage: Storage, private http: Http, private commonService: CommonServices) {}

  ionViewDidEnter () {
    this.storage.get(Keys.USER_INFO_KEY).then((userInfo) => {
      if (userInfo) {
        let params = new URLSearchParams();
        params.set('userId', userInfo.id);

        this.http.post(Keys.SERVICE_URL + '/member/userIndex', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          let result = res.json().result;
          this.userInfo = result;
          this.imageUrl = result.imageUrl;
          this.userSex = result.sex;
        });
      }
    });
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  /**
   * 退出登录
   */
  logout () {
    this.commonService.showConfirm('确定退出?', this.alertCtrl, (callback) => {
      if (callback) {
        this.storage.remove(Keys.USER_INFO_KEY);
        this.navCtrl.push(PersonalPage);
      }
    });
  }

  updateName () {
    this.navCtrl.push(NickNamePage, {userId: this.userInfo.id, nickname: this.userInfo.realname});
  }

  /**
   * 修改用户头像
   */
  updateHeadImage () {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
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

  updateSex () {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
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

  private _updateSex (sex: number) {
    let params = new URLSearchParams();
    params.set('id', this.userInfo.id);
    params.set('sex', sex.toString());
    this.http.post(Keys.SERVICE_URL + '/member/modifyUserInfo', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
      this.userSex = sex;
      this.storage.set(Keys.USER_INFO_KEY, res.json().data);
    });
  }

  private takePicture (type: number) {
    Camera.getPicture({
      destinationType: 1,
      sourceType: type,
      allowEdit: true,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      let loading = this.commonService.showLoading(this.loadingCtrl);
      let options = {
        fileKey: 'file',
        fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
        params: {userId: this.userInfo.id}
      };

      const fileTransfer = new Transfer();
      fileTransfer.upload(imageData, encodeURI(Keys.SERVICE_URL + '/member/modifyUserHeader'), options).then((res) => {
        let result = JSON.parse(res.response).data;
        this.imageUrl = result.imageUrl;
        this.storage.set(Keys.USER_INFO_KEY, result);
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
        this.commonService.showAlert('操作失败', this.alertCtrl);
      });
    });
  }
}
