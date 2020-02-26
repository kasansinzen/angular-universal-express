import { Component, OnInit } from '@angular/core';
import { MenuConfigService } from "src/app/core/services/menu-config.service";

@Component({
  selector: 'app-menu-store',
  templateUrl: './menu-store.component.html',
  styleUrls: ['./menu-store.component.scss']
})
export class MenuStoreComponent implements OnInit {
  storeMenuResult: object[];


  constructor(
    private mnuConfigService: MenuConfigService
  ) {
    this.storeMenuResult = this.mnuConfigService.getSideMenuList();
  }

  ngOnInit() {
  }

}
