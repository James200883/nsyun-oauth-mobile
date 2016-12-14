import {Component} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {DialogsServices} from "../../commons/services/DialogsServices";
import {NewsDetailPage} from "./newsDetail";

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})

export class NewsPage {
  private page: string = '1';
  private curCate: string = '-1';
  public hasMore: boolean = true;
  public news: any = [];
  public flag: string = '0';

  constructor (private navCtrl: NavController, private loadingCtrl: LoadingController, private http: Http, private dialogsService: DialogsServices) {}

  ionViewDidEnter () {
    this.searchNews(this.curCate);
  }

  //查询资讯
  public searchNews (curId: string) {
    this.page = '1';
    this.hasMore = true;
    this.curCate = curId;
    this.news = [];

    let params = new URLSearchParams();
    params.set('page', this.page);
    params.set('curCate', this.curCate);

    let loading = this.dialogsService.showLoading(this.loadingCtrl);
    this.http.get(Keys.SERVICE_URL + '/blog/findBlogsByPage', {search: params}).subscribe((res) => {
      let result = res.json();
      this.news = result.data;
      this.hasMore = result.next_page > 0;
      this.page = result.next_page;
      loading.dismiss();
    });
  }

  //上拉加载更多
  public doInfinite (infiniteScroll) {
    setTimeout(() => {
      let params = new URLSearchParams();
      params.set('page', this.page);
      params.set('curCate', this.curCate);

      this.http.get(Keys.SERVICE_URL + '/blog/findBlogsByPage', {search:params}).subscribe((res) => {
        let result = res.json();
        this.hasMore = result.next_page > 0;
        this.page = result.next_page;
        for (let n of result.data) {
          this.news.push(n);
        }
        infiniteScroll.complete();
      });
    }, 1000);
  }

  //跳转资讯详情
  public goToDetail (nId: string) {
    this.navCtrl.push(NewsDetailPage, {nId: nId});
  }
}
