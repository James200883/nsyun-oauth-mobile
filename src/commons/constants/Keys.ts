import {Headers} from '@angular/http';

export class Keys {
  static USER_INFO_KEY: string = "user_info_token";

  static SERVICE_URL: string = 'http://139.129.202.208:9280/nsyun-oauth-server';

  static USER_CART_KEY:string ='user_cart';

  static HEADERS: Headers = new Headers({'Content-Type': 'application/json'});

}
