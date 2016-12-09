import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";
import {DialogsServices} from "../../commons/services/DialogsServices";

@Component({
  selector: 'page-skuItems',
  templateUrl: 'skuItems.html'
})

export class SkuItemsPage {
  public productInfo: any = [];
  public quantity: number = 1;
  public price: number = 0.00;
  private currentOption: any;

  constructor (private viewCtrl: ViewController, private navParams: NavParams, private dialogsService: DialogsServices) {
    this.productInfo = navParams.get('product');
    this.price = parseFloat(this.productInfo.distPrice);
  }

  //规格items切换
  public chooseOption (skuItems, skuItem) {
    for (let i = 0; i < skuItems.length; i++) {
      skuItems[i].active = false;
    }
    skuItem.active = true;
    this.currentOption = skuItem;
  }

  //数量 加/减
  public quantityCount (type: string) {
    if (type == 'minus' && this.quantity > 1) {
      this.quantity -= 1;
    }
    if (type == 'plus') {
      this.quantity += 1;
    }
    this.calculatePrice();
  }

  //确定按钮
  public selectOption () {
    if (this.currentOption) {
      this.viewCtrl.dismiss({quantity: this.quantity, skuItem: this.currentOption});
    } else {
      this.viewCtrl.dismiss();
    }
  }

  //取消 关闭模态窗口
  public closeModal () {
    this.viewCtrl.dismiss();
  }

  //重新计算价格
  private calculatePrice () {
    this.price = parseFloat(this.productInfo.distPrice) * this.quantity;
  }
}
