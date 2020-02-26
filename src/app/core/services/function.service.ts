import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor() { }

  public apiUrl = (path: string = "") => {
    let api = "http://localhost:5000";
    // let api = "https://amulet-server.herokuapp.com";
    return `${api}/${path}`;
  }
  public adminUrl = (path: string = "") => {
    let url = "/store";
    return `${url}/${path}`;
  }

  private setMenuData = (name: string, url: string) => {
    return { name, url };
  }
  public headMenuList = () => {
    return [
      this.setMenuData("หน้าหลัก", ""),
      this.setMenuData("รายการพระ", "amulet"),
      this.setMenuData("ข่าวสาร", "blog"),
      this.setMenuData("การใช้งาน", "guide"),
      this.setMenuData("ติดต่อ", "contact")
    ];
  }
  public scrollToSectionElement = (el: HTMLElement) => {
    console.log("el", el)
    el.scrollIntoView({behavior:"smooth"});
  }
}
