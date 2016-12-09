import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {URLSearchParams, Http} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {AddMemberCertPage} from "./addMemberCert";

@Component({
  selector: 'page-memberCert',
  templateUrl: 'memberCert.html'
})

export class MemberCertPage {
  private userId: string;
  public certShops: any = [];

  constructor (private navCtrl: NavController, private navParams: NavParams, private http: Http) {
    this.userId = navParams.get('userId');
  }

  //页面载入完成加载数据
  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('userId', this.userId);

    this.http.get(Keys.SERVICE_URL + '/tradeUser/findTradeUserByUserId', {search: params}).subscribe((res) => {
      let results = res.json();
      this.certShops = results.shop;
    });
  }

  //去认证或修改所属门店
  public certOrModify (flag: string) {
    this.navCtrl.push(AddMemberCertPage, {userId: this.userId, flag: flag});
  }
}
