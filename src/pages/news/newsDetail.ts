import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Http, URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";

@Component({
  selector: 'page-new-detail',
  templateUrl: 'newsDetail.html'
})

export class NewsDetailPage {
  private nId: string;
  public newsDetail: any;

 constructor (private navParams: NavParams, private http: Http) {
   this.nId = navParams.get('nId');
 }

  ionViewDidEnter () {
    let params = new URLSearchParams();
    params.set('id', this.nId);

    this.http.get(Keys.SERVICE_URL + '/blog/findBlogInfoById', {search: params}).subscribe((res) => {
      this.newsDetail = res.json();
    });
  }

  //点赞
  public addCount (type: string) {
    let params = new URLSearchParams();
    params.set('id', this.nId);
    params.set('type', type);

    this.http.post(Keys.SERVICE_URL + '/blog/blogLike', {headers:Keys.HEADERS}, {search:params}).subscribe((res) => {
      let result = res.json();
      if (result.success == 'true') {
        if (type == 'like') {
          this.newsDetail.blog.countLike += 1;
        }
        if (type == 'wish') {
          this.newsDetail.blog.countWish += 1;
        }
      }
    });
  }
}
