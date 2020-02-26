import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { MaterialSharedModule } from '../../core/material-shared.module';

import { StoreRoutingModule } from './store-routing.module';
import { LoginComponent } from './login/login.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { StoreComponent } from './store.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogAddComponent } from './blog-add/blog-add.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { ProducttypeListComponent } from './producttype-list/producttype-list.component';
import { BlogTypeListComponent } from "./blog-type-list/blog-type-list.component";


@NgModule({
  declarations: [
    LoginComponent,
    ProductListComponent,
    ProductAddComponent,
    ProductEditComponent,
    StoreComponent,
    BlogListComponent,
    BlogAddComponent,
    BlogEditComponent,
    ProducttypeListComponent,
    BlogTypeListComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule,
    MaterialSharedModule,
  ]
})
export class StoreModule { }
