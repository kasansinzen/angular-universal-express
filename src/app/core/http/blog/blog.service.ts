import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { request } from 'http';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private apiService: ApiService
  ) { }

  public defaultBlogImage = (event) => {
    event.target.src = "/assets/images/blog/big-images/1.jpg";
  }

  public getBlogList = (requests: object = {}): Observable<any> => {
    return this.apiService.blogListQuery(requests).pipe(map(result => result['data']));
  }
  public getBlogDetail = (requests: object = {}): Observable<any> => {
    return this.apiService.blogDetailQuery(requests).pipe(map(result => result['data']));
  }
  public getBlogAlbumList = (requests: object): Observable<any> => {
    return this.apiService.blogAlbumQuery(requests).pipe(map(result => result['data']));
  }
  public addBlog = (requests: object): Observable<any> => {
    return this.apiService.addBlogQuery(requests);
  }
  public editBlog = (requests: object): Observable<any> => {
    return this.apiService.editBlogQuery(requests);
  }
  public destroyBlog = (requests: object): Observable<any> => {
    return this.apiService.destroyBlogQuery(requests);
  }
  public statusBlog = (requests: object): Observable<any> => {
    return this.apiService.statusBlogQuery(requests);
  }
  public uploadBlog = (formData: FormData, id: number | string): Observable<any> => {
    return this.apiService.uploadBlogQuery(formData, id);
  }
  public removeImageBlog = (requests: object): Observable<any> => {
    return this.apiService.removeImageBlogQuery(requests);
  }

  public getBlogTypeList = (requests: object = {}): Observable<any> => {
    return this.apiService.blogTypeListQuery(requests).pipe(map(result => result['data']));
  }
  public addBlogType = (requests: object): Observable<any> => {
    return this.apiService.addBlogTypeQuery(requests);
  }
  public editBlogType = (requests: object): Observable<any> => {
    return this.apiService.editBlogTypeQuery(requests);
  }
  public destroyBlogType = (requests: object): Observable<any> => {
    return this.apiService.destroyBlogTypeQuery(requests);
  }
}
