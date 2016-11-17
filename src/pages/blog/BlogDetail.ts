
/**
 * Created by hevan on 16/10/6.
 */
import {Component} from '@angular/core';
import {NavController, LoadingController, NavParams, ToastController} from 'ionic-angular';
import {Http,URLSearchParams} from "@angular/http";
import {Keys} from "../../commons/constants/Keys";
import {CommonServices} from "../../commons/services/CommonServices";

@Component({
  selector:'page-blog-detail',
  templateUrl: 'blog_detail.html',
  providers: [CommonServices]
})

export class BlogDetailPage {
  blogId:string;
  blog:any;

  constructor(private navCtrl: NavController,private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              public params: NavParams,private commonService:CommonServices,private http:Http){
    this.blogId = params.get('blogId');

    console.log(this.blogId);
    this.searchBlog();
  }


  searchBlog () {
    let loading = this.commonService.showLoading(this.loadingCtrl);

    let params = new URLSearchParams();
    params.set('id', this.blogId);

    this.http.get(Keys.SERVICE_URL + '/blog/findBlogInfoById', {search:params}).subscribe(res => {
      let result = res.json();
      this.blog = result;
      loading.dismiss();
    }, error => {
      loading.dismiss();
      this.commonService.showToastByHtml(this.toastCtrl, '服务器或网络异常');
    });
  }

  addBlogCount(id, type){
    let params = new URLSearchParams();
    params.set('id', id+'');
    params.set('type', type);


    this.http.post(Keys.SERVICE_URL +'/blog/blogLike', {headers:Keys.HEADERS},{search:params})
      .subscribe(res => {
        let retData = res.json();
        console.log(retData);
        if(retData.success === 'true'){

          if(type == 'like'){
            this.blog.countLike +=1;
          }else{
            this.blog.countWish +=1;
          }

        }else{

        }
      });
  }
}

