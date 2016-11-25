/**
 * Created by hevan on 2016/11/22.
 */

import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {CommonServices} from "../../../commons/services/CommonServices";
import {LoadingController} from "ionic-angular";

@Component({
  selector: 'page-my-about',
  templateUrl: 'about.html',
  providers: [CommonServices]
})

export class AboutPage {

  constructor (private loadingCtrl: LoadingController, private http: Http, private storage: Storage, private commonService: CommonServices) {}

  ionViewDidEnter () {

  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }
}

