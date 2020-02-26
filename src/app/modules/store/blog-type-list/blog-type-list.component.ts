import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlogService } from "src/app/core/http/blog/blog.service";
import { SweetalertService } from "src/app/core/services/sweetalert.service";
import { FormBlogTypeComponent } from "src/app/shared/components/form-blog-type/form-blog-type.component";

@Component({
  selector: 'app-blog-type-list',
  templateUrl: './blog-type-list.component.html',
  styleUrls: ['./blog-type-list.component.scss']
})
export class BlogTypeListComponent implements OnInit {

  blogTypeResult: object[];
  onLoadBlogType: any;

  constructor(
    private blogService: BlogService,
    private sweetalertService: SweetalertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getBlogTypes();
  }

  getBlogTypes() {
    this.blogService.getBlogTypeList().subscribe(result => this.blogTypeResult = result);
  }
  
  handleClickOpenFormBlogTypeDialog(event, formType: string, id: string | number = "", blogTypeName: string = "") {
    event.preventDefault();
    const dialogRef = this.dialog.open(FormBlogTypeComponent, {
      data: {formType, id, blogTypeName}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getBlogTypes();
    });
  }
  handleClickDestroyBlogType(event, id: number | string) {
    console.log("event", event);
    console.log("id", id);
    let onDestroyed = () => {
      this.blogService.destroyBlogType({id}).subscribe(result => {
        if(result['status'] == 200){
          this.sweetalertService.swalAlert("Deleted!", "Your file has been deleted.", 'success');
          this.getBlogTypes();
        }else{
          this.sweetalertService.swalAlert("Can't Delete", "Found some problems, Please retry again", 'error');
        }
      })
    }
    this.sweetalertService.swalComfirmAlert("Are you sure to Delete", "", onDestroyed)
  }

}
