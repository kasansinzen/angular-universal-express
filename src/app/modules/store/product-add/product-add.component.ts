import { Component, OnInit } from '@angular/core';
import { FunctionService } from "src/app/core/services/function.service";
import { ApiService } from "src/app/core/http/api.service";
import { ProductService } from "src/app/core/http/product/product.service";

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  productTypeResult: object[];

  constructor(
    private functionService: FunctionService,
    private resourceService: ApiService,
    private productService: ProductService
  ) {
  }

  ngOnInit() {
  }

  handleSubmitProduct(requests: object) {
   this.productService.addProductRecord(requests);
  }

}
