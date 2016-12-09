import {Component} from "@angular/core";
import {NavController, NavParams, LoadingController, AlertController, ToastController} from "ionic-angular";
import {URLSearchParams, Http} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";
import {AddEditSaleServicesPage} from "./addEditSaleServices";

@Component({
  selector: 'page-sales-service',
  templateUrl: 'saleService.html'
})

export class SalesServicePage {
  private userId: string;
  public saleServices: any = [];

  constructor (private navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  //页面载入完成加载数据
  ionViewDidEnter () {
    this.loadSaleServices();
  }

  //删除未处理的售后服务
  public delSaleService (id: string) {
    this.dialogsService.showConfirm('确认删除售后服务?', this.alertCtrl, callback => {
      if (callback) {
        let params = new URLSearchParams();
        params.set('idStr', id);

        let loading = this.dialogsService.showLoading(this.loadingCtrl);
        this.http.post(Keys.SERVICE_URL + '/saleMaint/del', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
          loading.dismiss();
          if (res.json().success == 'true') {
            this.dialogsService.showToast('删除成功', this.toastCtrl);
            this.loadSaleServices();
          } else {
            this.dialogsService.showToast('删除失败', this.toastCtrl);
          }
        });
      }
    });
  }

  //新增或删除售后服务
  public addOrEdit (id: string) {
    this.navCtrl.push(AddEditSaleServicesPage, {salesId: id, userId: this.userId});
  }

  private loadSaleServices () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/saleMaint/findByUserId', {search: params}).subscribe((res) => {
      this.saleServices = res.json();
      loading.dismiss();
    });
  }
}
