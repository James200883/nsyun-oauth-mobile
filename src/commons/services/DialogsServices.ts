import {AlertController, LoadingController, ToastController} from "ionic-angular";

export class DialogsServices {
  constructor () {}

  /**
   * ionic-angular alert
   * @param message
   * @param alertCtrl
   */
  public showAlert (message: string, alertCtrl: AlertController) {
    alertCtrl.create({
      title: '',
      subTitle: message,
      buttons: ['确定']
    }).present();
  }

  /**
   * ionic-angular confirm
   * @param message
   * @param alertCtrl
   * @param callback
   */
  public showConfirm (message: string, alertCtrl: AlertController, callback: any) {
    alertCtrl.create({
      title: '',
      message: message,
      buttons: [
        {
          text: '取消',
          handler: () => {
            callback(false);
          }
        },
        {
          text: '确定',
          handler: () => {
            callback(true);
          }
        }
      ]
    }).present();
  }

  /**
   * ionic-angular loading
   * @param loadingCtrl
   */
  public showLoading (loadingCtrl: LoadingController) {
    let loading = loadingCtrl.create({
      content: "请稍后..."
    });
    loading.present();
    return loading;
  }

  /**
   * ionic-angular toast
   * @param message
   * @param toastCtrl
   */
  public showToast (message: string, toastCtrl: ToastController) {
    toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }
}
