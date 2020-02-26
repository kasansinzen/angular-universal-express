import { Injectable } from '@angular/core';
import { FunctionService } from "./function.service";

@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {
  // Basic
  adminUrl: any;
  // Result
  storeMenuResult: {url: string, text: string}[];

  constructor(
    private functionService: FunctionService
  ) {
    this.adminUrl = this.functionService.adminUrl;
  }

  public setMenu(url: string, text: string) {
    return {url, text};
  }

  public getHeaderMenuList() {
    this.storeMenuResult = [
      this.setMenu('/', "Home"),
      this.setMenu('/amulet', "Amulets"),
      this.setMenu('/blog', "Blogs"),
      this.setMenu('/guide', "Guide"),
      this.setMenu('/contact', "Contact")
    ]

    return this.storeMenuResult;
    
  }

  public getSideMenuList() {
    this.storeMenuResult = [
      this.setMenu(this.adminUrl('/product'), "Product Management"),
      this.setMenu(this.adminUrl('/product-type'), "Product Type Management"),
      this.setMenu(this.adminUrl('/blog'), "Blog Management"),
      this.setMenu(this.adminUrl('/blog-type'), "Blog Type Management")
    ]

    return this.storeMenuResult;
  }
}
