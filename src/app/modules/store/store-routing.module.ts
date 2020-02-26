import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductAddComponent } from "./product-add/product-add.component";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { BlogListComponent } from "./blog-list/blog-list.component";
import { BlogAddComponent } from "./blog-add/blog-add.component";
import { BlogEditComponent } from "./blog-edit/blog-edit.component";
import { StoreComponent } from "./store.component";
import { ProducttypeListComponent } from "./producttype-list/producttype-list.component";
import { BlogTypeListComponent } from "./blog-type-list/blog-type-list.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: StoreComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProductListComponent },
      { 
        path: 'product',
        children: [
          { path: '', component: ProductListComponent },
          { path: 'add', component: ProductAddComponent },
          { path: 'edit/:id', component: ProductEditComponent },
        ]
      },
      { 
        path: 'product-type',
        children: [{ path: '', component: ProducttypeListComponent }]
      },
      {
        path: 'blog',
        children: [
          { path: '', component: BlogListComponent },
          { path: 'add', component: BlogAddComponent },
          { path: 'edit/:id', component: BlogEditComponent },
        ]
      },
      { 
        path: 'blog-type',
        children: [{ path: '', component: BlogTypeListComponent }]
      },
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
