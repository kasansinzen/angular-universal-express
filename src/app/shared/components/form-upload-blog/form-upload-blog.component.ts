import { Component, OnInit, Input } from '@angular/core';
import { BlogService } from "src/app/core/http/blog/blog.service";
import { SweetalertService } from "src/app/core/services/sweetalert.service";
import { Router } from "@angular/router";

@Component({
  selector: 'form-upload-blog',
  templateUrl: './form-upload-blog.component.html',
  styleUrls: ['./form-upload-blog.component.scss']
})
export class FormUploadBlogComponent implements OnInit {
  @Input('blog-id') blogId: string;
  
  // Basic
  defaultBlogImage: any;
  isUploadLoading: boolean = false;
  isDisabled: boolean = false;
  isUpload: boolean = true;
  // Result
  blogImageResult: object | any;
  // Files
  filesPathPreiview: string | any;
  filesUploading: File[] = [];

  constructor(
    private blogService: BlogService,
    private sweetalertService: SweetalertService,
    private router: Router
  ) {
    this.defaultBlogImage = this.blogService.defaultBlogImage;
  }

  ngOnInit() {
    this.getBlogAlbums();
  }

  getBlogAlbums() {
    this.blogService.getBlogAlbumList({id: this.blogId}).subscribe(result => {
      this.isUpload = result.length <= 0;
      this.blogImageResult = result.length > 0 ? result[0] : {};
      this.filesPathPreiview = this.blogImageResult.filepath ? this.blogImageResult.filepath : "";
    });
  }

  handleChangeUploadBanner(event) {
    let target = event.target;
    this.filesUploading.push(...target.files);
    let filesReader = new FileReader();
    filesReader.readAsDataURL(this.filesUploading[0]);
    filesReader.onload = () => {
      this.filesPathPreiview = filesReader.result;
    }
  }
  handleClickUpload(event) {
    this.isUploadLoading = true;
    this.isDisabled = true;
    let fileUploadingData = new FormData();
    this.filesUploading.forEach(file => {
      fileUploadingData.append("blog_images", file)
    });

    this.sweetalertService.swalToastLoading();
    this.blogService.uploadBlog(fileUploadingData, this.blogId).subscribe(result => {
      let blogId = result['insertId'];

      let status = result['status'] == 200;
      let alert = result['status'] == 200 ? "Success, Image Uploaded" : "Error, Can't Upload Image";
      let onDone = () => {
        this.isUploadLoading = false;
        this.isDisabled = false;
        this.getBlogAlbums();
      };

      this.sweetalertService.swalToastAlert(status, alert, onDone)
    });
  }
  handleClickRemove(event) {
    this.isUploadLoading = true;
    this.isDisabled = true;
    
    this.sweetalertService.swalComfirmAlert("Are you sure to Remove Image", "", () => {
      this.blogService.removeImageBlog({id: this.blogImageResult.blog_album_id}).subscribe(result => {
        console.log("result", result)
        if(result['status'] == 200){
          this.getBlogAlbums();
          this.sweetalertService.swalAlert("Remove!", "Your file has been removed.", 'success');
        }else{
          this.sweetalertService.swalAlert("Can't Remove", "Found some problems, Please retry again", 'error');
        }
        this.isUploadLoading = false;
        this.isDisabled = false;
      })
    });
  }
}
