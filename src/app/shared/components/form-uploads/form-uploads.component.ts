import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

import { ApiService } from "src/app/core/http/api.service";
import { ProductService } from "src/app/core/http/product/product.service";
import { SweetalertService } from "src/app/core/services/sweetalert.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-uploads',
  templateUrl: './form-uploads.component.html',
  styleUrls: ['./form-uploads.component.scss']
})
export class FormUploadsComponent implements OnInit {
  @Input('product-id') productId: number | string;
  @Output('setProfile') setProfile:EventEmitter<any> = new EventEmitter();

  // Basic
  isUploadLoading: boolean = false;
  filesUploading: File[] = [];
  // Result
  productImages: object[];

  @ViewChild('myPond', {static: false}) myPond: any;

  constructor(
    private resourceService: ApiService,
    private productService: ProductService,
    private sweetalertService: SweetalertService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getProductImages();
  }

  handleClickUpload(event) {
    this.isUploadLoading = true;
    let fileUploadingData = new FormData();
    this.filesUploading.forEach(file => {
      fileUploadingData.append("product_images", file)
    });

    let Toast = this.sweetalertService.swalToastConfig();
    Toast.showLoading();
 
    this.resourceService.uploadProductQuery(fileUploadingData, this.productId).subscribe(result => {
      if (result['status'] == 200) {
        Toast.fire({
          icon: 'success',
          title: "Successfully, Image Uploaded",
          onClose: () => { this.isUploadLoading = false; }
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: "Error, Can't Upload Image"
        })
      }
      
      this.filesUploading = [];
      this.getProductImages();
    })
  }
  handleClickRemove(event, id: number | string) {
    Swal.fire({
      title: 'Are you sure to Remove Image',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.value) {
        this.productService.removeImageProduct(id).subscribe(result => {
          if(result['status'] == 200) {
            this.getProductImages();
            Swal.fire('Remove!', 'Your file has been removed.', 'success');
          }else{
            Swal.fire("Can't Remove", "Found some problems, Please retry again", 'error');
          }
        });
      }
    })
    
  }
  handleClickSetProfile(event, id: number | number) {
    this.setProfile.emit(id);
    this.getProductImages();
    // this.productService.setProfileProduct(this.productId, id).subscribe(result => {
    //   console.log("result", result)
    // });
  }
 
  onSelect(event) {
    this.filesUploading.push(...event.addedFiles);
  }
  onRemove(event) {
    this.filesUploading.splice(this.filesUploading.indexOf(event), 1);
  }

  getProductImages() {
    this.productService.getProductAlbum(this.productId).subscribe(result => this.productImages = result['data']);
  }
}