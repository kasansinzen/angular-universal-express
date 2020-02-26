import { Component, OnInit } from '@angular/core';
import { SweetalertService } from "src/app/core/services/sweetalert.service";
import Swal from "sweetalert2";
import { BlogService } from "src/app/core/http/blog/blog.service";

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  // Basic
  defaultBlogImage: any;
  isLoading: boolean;
  // Result
  blogResult: object[];

  constructor(
    private sweetalertService: SweetalertService,
    private blogService: BlogService
  ) {
    this.defaultBlogImage = this.blogService.defaultBlogImage;
    // this.blogResult = new Array(9);
  }

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.blogService.getBlogList().subscribe(result => this.blogResult = result);
  }

  handleClickDestroyBlog(event, id) {
    let blogFilter = this.blogResult.find(result => result['blog_id'] == id);
    if(!blogFilter) return false;
    this.sweetalertService.swalComfirmAlert("Are you sure to Remove to Delete", `Blogt ID: ${id} | Blogt Name: ${blogFilter['title']}`, () => {
      this.blogService.destroyBlog({id: blogFilter['blog_id']}).subscribe(result => {
        if(result['status'] == 200){
          this.getBlogs();
          this.sweetalertService.swalAlert("Remove!", "Your file has been removed.", 'success');
        }else{
          this.sweetalertService.swalAlert("Can't Remove", "Found some problems, Please retry again", 'error');
        }
      })
    });
  }
  handleChangeSliceToggle(event, id) {
    let blogFilter = this.blogResult.find(result => result['blog_id'] == id);
    if(blogFilter == undefined) return false;
    let typeStatus = !blogFilter['status'] == true ? "ON" : "OFF";
    this.blogService.statusBlog({status: !blogFilter['status'], id}).subscribe(result => {
      this.getBlogs();
      let statusResult = result.status == 200;
      let titleAlert = statusResult ? `Successfuly, Blog ID: ${id} | Status: ${typeStatus}` : `Error, Can't Change Status Blog ID: ${id}`;
      this.sweetalertService.swalToastAlert(statusResult, titleAlert);
    });
  }
}
