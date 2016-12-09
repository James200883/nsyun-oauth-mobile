import {Component} from "@angular/core";
import {NavParams, NavController, ToastController, LoadingController} from "ionic-angular";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {URLSearchParams, Http} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector: 'page-addEditSaleServices',
  templateUrl: 'addEditSaleServices.html'
})

export class AddEditSaleServicesPage {
  private userId: string;
  private salesId: string;
  public type: string = '4';
  public address: string;
  public info: string;

  constructor (private navCtrl: NavController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
    this.salesId = navParams.get('salesId');
    if (this.salesId) {
      this.getSaleServiceById(this.salesId);
    }
    if (!this.salesId) {
      this.salesId = '0';
    }
  }

  //新增或修改
  public addEditSaleService () {
    if (this.address && this.info && this.type) {
      let params = new URLSearchParams();
      params.set('user.id', this.userId);
      params.set('id', this.salesId);
      params.set('address', this.address);
      params.set('info', this.info);
      params.set('type', this.type);

      let loading = this.dialogsService.showLoading(this.loadingCtrl);
      this.http.post(Keys.SERVICE_URL + '/saleMaint/save', {headers: Keys.HEADERS}, {search: params}).subscribe((res) => {
        console.log(res.json());
        loading.dismiss();
        if (res.json().success == 'true') {
          this.dialogsService.showToast('保存成功', this.toastCtrl);
          this.navCtrl.pop();
        } else {
          this.dialogsService.showToast('保存失败', this.toastCtrl);
        }
      });
    } else {
      this.dialogsService.showToast('请填写完整服务信息', this.toastCtrl);
    }
  }

  //根据ID获取数据
  private getSaleServiceById (id: string) {
    let params = new URLSearchParams();
    params.set('id', id);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/saleMaint/findById', {search: params}).subscribe((res) => {
      let result = res.json();
      this.address = result.address;
      this.info = result.info;
      this.type = result.type;
      loading.dismiss();
    });
  }
}
