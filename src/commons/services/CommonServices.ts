import {Injectable} from '@angular/core';
import {Toast} from "ionic-native";
import {AlertController, LoadingController, Loading} from "ionic-angular";

@Injectable()
export class CommonServices {
  /**
   * cordova plugin toast
   * @param message
   * @param position values--'top' 'bottom' 'center'
   */
  showToast (message: string, position: string): void {
    Toast.show(message, 'short', position).subscribe();
  }

  /**
   * ionic-angular alert
   * @param message
   * @param alertCtrl
   */
  showAlert (message: string, alertCtrl: AlertController): void {
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
  showConfirm (message: string, alertCtrl: AlertController, callback) {
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
    }).present()
  }

  /**
   * ionic-angular loading
   * @param loadingCtrl
   * @returns {Loading}
   */
  showLoading (loadingCtrl: LoadingController): Loading {
    let loading = loadingCtrl.create({
      content: "Loading..."
    });
    loading.present();
    return loading;
  }

}
