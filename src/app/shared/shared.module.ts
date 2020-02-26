import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialSharedModule } from '../core/material-shared.module';
import { DropzoneSharedModule } from '../core/dropzone-shared.module';
import { NgxFilesizeModule } from 'ngx-filesize';
import { CookieService } from "ngx-cookie-service";
import { CKEditorModule } from 'ckeditor4-angular';
// declarations
import { BannerSlideComponent } from "./components/banner-slide/banner-slide.component";
import { BannerImageComponent } from "./components/banner-image/banner-image.component";
import { FormProductComponent } from "./components/form-product/form-product.component";
import { MenuStoreComponent } from "./components/menu-store/menu-store.component";
import { FormBlogComponent } from "./components/form-blog/form-blog.component";
import { FormUploadsComponent } from "./components/form-uploads/form-uploads.component";
import { SliderContainerDirective } from "./directives";
import { FormProductTypeComponent } from "./components/form-product-type/form-product-type.component";
import { FormBlogTypeComponent } from './components/form-blog-type/form-blog-type.component';
import { FormUploadBlogComponent } from './components/form-upload-blog/form-upload-blog.component';

@NgModule({
  declarations: [
    BannerSlideComponent,
    BannerImageComponent,
    FormProductComponent,
    MenuStoreComponent,
    FormBlogComponent,
    SliderContainerDirective,
    FormUploadsComponent,
    FormProductTypeComponent,
    FormBlogTypeComponent,
    FormUploadBlogComponent
  ],
  exports: [
    BannerSlideComponent,
    BannerImageComponent,
    FormProductComponent,
    MenuStoreComponent,
    FormBlogComponent,
    SliderContainerDirective,
    FormUploadsComponent,
    FormProductTypeComponent,
    FormUploadBlogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialSharedModule,
    DropzoneSharedModule,
    NgxFilesizeModule,
    CKEditorModule
  ],
  entryComponents: [
    FormProductTypeComponent,
    FormBlogTypeComponent
  ],
  providers: [ CookieService ]
})
export class SharedModule { }
