/**
 * Created by hevan on 16/10/6.
 */
import {Component} from '@angular/core';
import {NavController, LoadingController, AlertController} from "ionic-angular";
import {BlogDetailPage} from './BlogDetail';
import {Http,URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {CommonServices} from "../../commons/services/CommonServices";



@Component({
  selector:'page-blog-list',
  templateUrl: 'blog_list.html',
  providers: [CommonServices]
})

export class BlogListPage {
  cateColorAll:string ='secondary';
  cateColor1:string;
  cateColor2:string;
  cateColor3:string;

  page: string = '1';
  curCate: any;
  hasMore: boolean = true;
  blogs = [];

  constructor(private navCtrl: NavController,private loadingCtrl: LoadingController, public commonService:CommonServices,private alertCtrl: AlertController, private http:Http){
    this.curCate = -1;
    this.searchBlog();
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }

  public goBlogDetail(blogId){
    this.navCtrl.push(BlogDetailPage,{'blogId':blogId});
  }

  public changeCate(blogCategoryId){

    if(-1 == blogCategoryId){
      this.cateColorAll = 'secondary';
      this.cateColor1='';
      this.cateColor2='';
      this.cateColor3='';
      this.curCate = -1;
    }else if(1 == blogCategoryId){
      this.cateColorAll = '';
      this.cateColor1='secondary';
      this.cateColor2='';
      this.cateColor3='';
      this.curCate = 1;
    }else if(2 == blogCategoryId){
      this.cateColorAll = '';
      this.cateColor1='';
      this.cateColor2='secondary';
      this.cateColor3='';
      this.curCate = 2;
    }else if(3 == blogCategoryId){
      this.cateColorAll = '';
      this.cateColor1='';
      this.cateColor2='';
      this.cateColor3='secondary';
      this.curCate = 3;
    }

    this.searchBlog();
  }

  searchBlog () {
    this.page = '1';
    this.hasMore = true;
    this.blogs = [];
    let loading = this.commonService.showLoading(this.loadingCtrl);

    let params = new URLSearchParams();
    params.set('page', this.page);
    params.set('curCate', this.curCate);

    this.http.get(Keys.SERVICE_URL + '/blog/findBlogsByPage', {search:params}).subscribe(res => {
      let result = res.json();
      this.blogs = result.data;
      this.hasMore = result.next_page > 0;
      this.page = result.next_page;
      loading.dismiss();
    }, error => {
      loading.dismiss();
      this.commonService.showToast('服务器或网络异常', 'center');
    });
  }

  /**
   * 上拉加载更多
   * @param infiniteScroll
   */
  doInfinite (infiniteScroll) {
    setTimeout(() => {
      let params = new URLSearchParams();
      params.set('page', this.page);
      params.set('curCate', this.curCate);

      this.http.get(Keys.SERVICE_URL + '/blog/findBlogsByPage', {search:params}).subscribe(res => {
        let result = res.json();
        this.hasMore = result.next_page > 0;
        this.page = result.next_page;
        for (let blog of result.data) {
          this.blogs.push(blog);
        }
        infiniteScroll.complete();
      }, error => {
        infiniteScroll.complete();
        this.commonService.showToast('加载更多数据失败', 'center');
      });
    }, 1000);
  }
}
