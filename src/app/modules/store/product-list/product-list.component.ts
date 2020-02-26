import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/core/http/api.service";
import { SweetalertService } from "src/app/core/services/sweetalert.service";
import Swal from "sweetalert2";
import { ProductService } from "src/app/core/http/product/product.service";

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  // Basic
  defaultProductImage: any;
  isLoading: boolean;
  // Result
  productResult: object[];
  
  constructor(
    private resourceService: ApiService,
    private sweetalertService: SweetalertService,
    private productService: ProductService
  ) {
    this.defaultProductImage = this.productService.defaultProductImage;
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts(requests: object = {}) {
    this.isLoading = true;
    this.resourceService.productListQuery(requests).subscribe(result => {
      this.isLoading = false;
      this.productResult = result['data'];
    });
  }

  handleClickDestroyProduct(event, id: number | string) {
    let productFilter = this.productResult.find(result => result['product_id'] == id);
    if(!productFilter) return false;

    Swal.fire({
      title: 'Are you sure to Delete',
      text: `Product ID: ${id} | Product Name: ${productFilter['product_name']}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        return this.resourceService.destroyProductQuery({ id: productFilter['product_id'] }).subscribe(result => {
          if (result['status'] == 200) {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.getProducts();
          } else {
            Swal.fire("Can't Delete", "Found some problems, Please retry again", 'error');
          }
        });
      }
    })
  }
  handleChangeSliceToggle(event, id) {
    const productFilter: object = this.productResult.find(product => product['product_id'] == id);
    if(productFilter == undefined) return false;
    let typeStatus = !productFilter['status'] == true ? "ON" : "OFF";
    this.resourceService.statusProductQuery({status: !productFilter['status'], id}).subscribe(result => {
      this.getProducts();
      let statusResult = result.status == 200;
      let titleAlert = statusResult ? `Successfuly, Product ID: ${id} | Status: ${typeStatus}` : `Error, Can't Change Status Product ID: ${id}`;
      this.sweetalertService.swalToastAlert(statusResult, titleAlert);
    });
  }

}
