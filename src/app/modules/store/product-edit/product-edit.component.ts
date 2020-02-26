import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/core/http/api.service";
import { FunctionService } from "src/app/core/services/function.service";
import { ProductService } from "src/app/core/http/product/product.service";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  // Param
  productId: number | string;

  // Basic
  // scrollToSectionElement: any;
  defaultProductImage: any;

  // Result
  productResult: {product_profile: string};

  constructor(
    private route: ActivatedRoute,
    private resourceService: ApiService,
    private functionService: FunctionService,
    private productService: ProductService
  ) {
    this.productId = this.route.snapshot.paramMap.get('id');
    // this.scrollToSectionElement = this.functionService.scrollToSectionElement;
    this.defaultProductImage = this.productService.defaultProductImage;
  }

  ngOnInit() {
    this.productService.getProductDetail(this.productId).subscribe(result => this.productResult = result['data']);
  }

  public scrollToSectionElement = (el: HTMLElement) => {
    el.scrollIntoView({behavior:"smooth"});
  }

  setProfile(id: number | number) {
    console.log("setProfile", id)
    this.productService.setProfileProduct(this.productId, id).subscribe(result => {
      // if(result != 200) return false;
      console.log("result", result)
      this.productService.getProductDetail(this.productId).subscribe(result => this.productResult = result['data']);
    });
  }

}
