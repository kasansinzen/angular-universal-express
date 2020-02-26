import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { FunctionService } from "src/app/core/services/function.service";
import { ApiService } from "src/app/core/http/api.service";
import { BlogService } from "src/app/core/http/blog/blog.service";
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SweetalertService } from "src/app/core/services/sweetalert.service";

@Component({
  selector: 'app-form-blog',
  templateUrl: './form-blog.component.html',
  styleUrls: ['./form-blog.component.scss']
})
export class FormBlogComponent implements OnInit {
  @Input('form-type') formType: string;
  @Input('blog-id') blogId: string;
  // Basic
  adminUrl: any;
  btnSubmitName: string;
  // Editor: ClassicEditor = ClassicEditor;
  blogFormGroup: FormGroup;
  isDisabled: boolean = false;
  // Result
  blogTypeResult: object[];
  blogResult: object | any;

  constructor(
    private functionService: FunctionService,
    private resourceService: ApiService,
    private blogService: BlogService,
    private formBuilder: FormBuilder,
    private sweetalertService: SweetalertService,
    private router: Router
  ) {
    this.blogFormGroup = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      content: ["", Validators.required],
      blogTypeId: ["", Validators.required]
    });
    this.adminUrl = this.functionService.adminUrl;
  }

  ngOnInit() {
    this.btnSubmitName = this.formType ? this.formType : "Save";
    this.blogService.getBlogTypeList().subscribe(result => this.blogTypeResult = result);
    this.getBlog({id: this.blogId});
  }

  getBlog(requests: object) {
    this.blogService.getBlogDetail(requests).subscribe(result => {
      this.blogResult = result;
      this.blogFormGroup.setValue({
        title: this.blogResult.title,
        description: this.blogResult.description,
        content: this.blogResult.content,
        blogTypeId: this.blogResult.blog_type_list.map(result => result.blog_type_id)
      })
    });
  }

  handleSubmitBlog(event) {
    this.isDisabled = true;
    let requests = {
      title: this.blogFormGroup.get('title').value,
      description: this.blogFormGroup.get('description').value,
      blog_type_id: this.blogFormGroup.get('blogTypeId').value
    };
    console.log("requests", requests)
    switch(this.formType){
      case "add":
        this.blogService.addBlog(requests).subscribe(result => {
          let blogId = result['insertId'];

          let status = result['status'] == 200;
          let alert = result['status'] == 200 ? "Success, Data Blog Added" : "Failed, Can't Add Data Blog";
          let onDone = () => {
            this.isDisabled = false;
            this.router.navigate([this.adminUrl(`blog/edit/${blogId}`)]);
          };
    
          this.sweetalertService.swalToastAlert(status, alert, onDone)
        });
        break;
      case "edit":
        this.blogService.editBlog({...requests, id: this.blogId}).subscribe(result => {
          let blogId = result['insertId'];

          let status = result['status'] == 200;
          let alert = result['status'] == 200 ? "Success, Data Blog Edited" : "Failed, Can't Edit Data Blog";
          let onDone = () => {
            this.isDisabled = false;
            this.router.navigate([this.adminUrl(`blog/edit/${blogId}`)]);
          };
    
          this.sweetalertService.swalToastAlert(status, alert, onDone)
        });
        break;
    }
  }
  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
