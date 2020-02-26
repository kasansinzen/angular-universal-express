import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { FunctionService } from "../services/function.service";
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: any;
  headerTypeJson: HttpHeaders;
  headerTypeMultipart: HttpHeaders;

  constructor(
    private http: HttpClient,
    private functionService: FunctionService
  ) {
    this.apiUrl = this.functionService.apiUrl;
    this.headerTypeJson = new HttpHeaders({'Content-Type': 'application/json'});
    this.headerTypeMultipart = new HttpHeaders({'Content-Type': 'multipart/form-data'});
  }

  // PRODUCT
  public productListQuery(requests = {}){
    return this.http.get<any>(this.apiUrl("api/product-list"), {params: new HttpParams({fromObject: requests})});
  }
  public productDetailQuery(requests = {}){
    return this.http.get<any>(this.apiUrl("api/product-detail"), {params: new HttpParams({fromObject: requests})});
  }
  public addProductQuery(requests: object){
    return this.http.post<any>(this.apiUrl("api/add-product"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public editProductQuery(requests: object){
    return this.http.put<any>(this.apiUrl("api/edit-product"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public destroyProductQuery(requests: {}){
    return this.http.delete<any>(this.apiUrl("api/destroy-product"), {params: new HttpParams({fromObject: requests})});
  }
  public statusProductQuery(requests: object){
    return this.http.patch<any>(this.apiUrl("api/status-product"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public uploadProductQuery(formData: FormData, id: number | string){
    return this.http.post<any>(this.apiUrl("api/upload-product"), formData, {headers: new HttpHeaders({'Product-ID': `${id}`})});
  }
  public productAlbumQuery(requests: {}){
    return this.http.get<any>(this.apiUrl("api/product-album"), {params: new HttpParams({fromObject: requests})});
  }
  public removeImagePoductQuery(requests: {}){
    return this.http.delete<any>(this.apiUrl("api/remove-image-product"), {params: new HttpParams({fromObject: requests})});
  }
  public setProfilePoductQuery(requests: object){
    return this.http.patch<any>(this.apiUrl("api/set-profile-product"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }

  // PRODUCT TYPE
  public productTypeListQuery(requests: object | any){
    return this.http.get<any>(this.apiUrl("api/producttype-list"), {params: new HttpParams({fromObject: requests})});
  }
  public addProductTypeQuery(requests: object){
    return this.http.post<any>(this.apiUrl("api/add-producttype"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public editProductTypeQuery(requests: object){
    return this.http.put<any>(this.apiUrl("api/edit-producttype"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public destroyProductTypeQuery(requests: object | any){
    return this.http.delete<any>(this.apiUrl("api/destroy-producttype"), {params: new HttpParams({fromObject: requests})});
  }

  // BLOG
  public blogListQuery(requests: object | any = {}){
    return this.http.get<any>(this.apiUrl("api/blog-list"), {params: new HttpParams({fromObject: requests})});
  }
  public blogDetailQuery(requests: object | any){
    return this.http.get<any>(this.apiUrl("api/blog-detail"), {params: new HttpParams({fromObject: requests})});
  }
  public addBlogQuery(requests: object){
    return this.http.post<any>(this.apiUrl("api/add-blog"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public editBlogQuery(requests: object){
    return this.http.put<any>(this.apiUrl("api/edit-blog"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public destroyBlogQuery(requests: {}){
    return this.http.delete<any>(this.apiUrl("api/destroy-blog"), {params: new HttpParams({fromObject: requests})});
  }
  public statusBlogQuery(requests: object){
    return this.http.patch<any>(this.apiUrl("api/status-blog"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public uploadBlogQuery(formData: FormData, id: number | string){
    return this.http.post<any>(this.apiUrl("api/upload-blog"), formData, {headers: new HttpHeaders({'Blog-ID': `${id}`})});
  }
  public removeImageBlogQuery(requests: object | any){
    return this.http.delete<any>(this.apiUrl("api/remove-image-blog"), {params: new HttpParams({fromObject: requests})});
  }
  public blogAlbumQuery(requests: object | any){
    return this.http.get<any>(this.apiUrl("api/blog-album"), {params: new HttpParams({fromObject: requests})});
  }

  // BLOG TYPE
  public blogTypeListQuery(requests: object | any){
    return this.http.get<any>(this.apiUrl("api/blogtype-list"), {params: new HttpParams({fromObject: requests})});
  }
  public addBlogTypeQuery(requests: object){
    return this.http.post<any>(this.apiUrl("api/add-blogtype"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public editBlogTypeQuery(requests: object){
    return this.http.put<any>(this.apiUrl("api/edit-blogtype"), JSON.stringify(requests), {headers: this.headerTypeJson});
  }
  public destroyBlogTypeQuery(requests: object | any){
    return this.http.delete<any>(this.apiUrl("api/destroy-blogtype"), {params: new HttpParams({fromObject: requests})});
  }

  // USER
  public userVerifyQuery(requests: object | any){
    return this.http.get<any>(this.apiUrl("api/user-verify"), {params: new HttpParams({fromObject: requests})});
  }
}
