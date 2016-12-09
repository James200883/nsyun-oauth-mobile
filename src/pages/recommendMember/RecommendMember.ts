import {Component} from "@angular/core";
import {NavParams, LoadingController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector: 'page-recommend-member',
  templateUrl: 'RecommendMember.html'
})

export class RecommendMemberPage {
  private userId: string;
  public recommendMembers: any = [];

  constructor (private loadingCtrl: LoadingController, private navParams: NavParams, private http: Http, private dialogsService: DialogsServices) {
    this.userId = navParams.get('userId');
  }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('user.id', this.userId);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/userFollow/findAllUserFollow', {search: params}).subscribe((res) => {
      this.recommendMembers = res.json();
      loading.dismiss();
    });
  }
}
