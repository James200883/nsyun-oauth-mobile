export class OrderItem {
  private productId: string;
  private name: string;
  private imageUrl: string;
  private sku: string;
  private qty: number;
  private price: number;
  private distPrice: number;
  private amount: number;
  private isChecked: boolean;

  constructor (data: any = {}) {
    this.productId = data.productId || '';
    this.name = data.name || '';
    this.imageUrl = data.imageUrl || '';
    this.sku = data.sku || '';
    this.qty = data.qty || 0;
    this.price = data.price || 0.00;
    this.distPrice = data.distPrice || 0.00;
    this.amount = (this.getDisPrice() * this.getQty()) || 0.00;
    this.isChecked = false;
  }

  public getProductId (): string {
    return this.productId;
  }

  public getName (): string {
    return this.name;
  }

  public getImageUrl (): string {
    return this.imageUrl;
  }

  public getSku () : string {
    return this.sku;
  }

  public getQty (): number {
    return this.qty;
  }

  public getPrice (): number {
    return this.price;
  }

  public getDisPrice (): number {
    return this.distPrice;
  }

  public getAmount (): number {
    return this.amount;
  }

  public getIsChecked (): boolean {
    return this.isChecked;
  }
}
