import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { BlogService } from "src/app/core/http/blog/blog.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SweetalertService } from "src/app/core/services/sweetalert.service";

@Component({
  selector: 'app-form-blog-type',
  templateUrl: './form-blog-type.component.html',
  styleUrls: ['./form-blog-type.component.scss']
})
export class FormBlogTypeComponent implements OnInit {

  @Input('form-type') formType: string;
  @Input('blogtype-id') blogTypeId: string | number;
  @Input('blogtype-name') blogTypeName: string;

  // Dialog
  dataDialog: string;
  // Basic
  btnSubmitName: string;
  blogTypeFormGroup: FormGroup;
  isDisabled: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<FormBlogTypeComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private blogService: BlogService,
    private formBuilder: FormBuilder,
    private sweetalertService: SweetalertService
  ) {
    this.formType = data.formType ? data.formType : this.formType;
    this.blogTypeId = data.id ? data.id : this.blogTypeId;
    this.blogTypeName = data.blogTypeName ? data.blogTypeName : this.blogTypeName;

    this.blogTypeFormGroup = this.formBuilder.group({
      blogTypeName: [this.blogTypeName, Validators.required]
    });
  }

  ngOnInit() {
    this.btnSubmitName = this.formType ? this.formType : "Save";
  }

  handleSubmitBlogType(event) {
    this.isDisabled = true;
    let requests = {blog_type_name: this.blogTypeFormGroup.get('blogTypeName').value};
    let onDone = () => this.isDisabled = false;
    switch(this.formType){
      case "add":
        this.blogService.addBlogType(requests).subscribe(result => {
          let status = result['status'] == 200;
          let alert = result['status'] == 200 ? "Success, Data Blog Typed Added" : "Failed, Can't Add Data Blog Type";
    
          this.sweetalertService.swalToastAlert(status, alert, onDone)
        });
        break;
      case "edit":
        this.blogService.editBlogType({...requests, id: this.blogTypeId}).subscribe(result => {
          let status = result['status'] == 200;
          let alert = result['status'] == 200 ? "Success, Data Blog Typed Edited" : "Failed, Can't Add Data Blog Type";
    
          this.sweetalertService.swalToastAlert(status, alert, onDone)
        });
        break;
    }
  }

}
