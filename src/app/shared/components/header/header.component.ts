import { Component, OnInit } from '@angular/core';
import { MenuConfigService } from "src/app/core/services/menu-config.service";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "src/app/core/http/user/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerMenuList: object;
  isSigning: boolean = false;

  constructor(
    private menuConfigService: MenuConfigService,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {
    this.headerMenuList = this.menuConfigService.getHeaderMenuList();
  }

  ngOnInit() {
    this.isSigning = this.cookieService.check('user_id');
  }

  handleClickSignout(event) {
    this.userService.signoutUser();
    // this.router.navigate(['signin']);
    window.location.href = "/signin";
  }

}
