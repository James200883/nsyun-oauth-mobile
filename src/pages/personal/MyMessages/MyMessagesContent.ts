import {Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'page-my-messages-content',
  templateUrl: 'MyMessagesContent.html'
})

export class MyMessagesContentPage {
  messageContent: string

  constructor (public navCtrl: NavController, private navParams: NavParams) {
    this.messageContent = navParams.get('messageContent');
  }

  ionViewWillEnter () {
    document.querySelector('#tabs .tabbar')['style'].display = 'none';
  }
}
