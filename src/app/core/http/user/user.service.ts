import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  public authUserVerify(username: string, password: string): Observable<any> {
    return this.apiService.userVerifyQuery({username, password}).pipe(map(result => {
      let data = result['data'];
      if(data.length > 0){
        this.cookieService.set("user_id", data[0]['user_id']);
        this.cookieService.set("user_fullname", data[0]['fullname']);
        this.cookieService.set("username", data[0]['username']);
      }
      return data.length > 0
    }));
  }

  public signoutUser() {
    // this.cookieService.deleteAll()
    this.cookieService.delete("user_id");
    this.cookieService.delete("user_fullname");
    this.cookieService.delete("username");
  }
}