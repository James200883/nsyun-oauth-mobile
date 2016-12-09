import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
@Component({
  selector: 'page-message-content',
  templateUrl: 'messageContent.html'
})

export class MessageContentPage {
  public messageContent: string;

  constructor (private navParams: NavParams) {
    this.messageContent = navParams.get('messageContent');
  }
}
