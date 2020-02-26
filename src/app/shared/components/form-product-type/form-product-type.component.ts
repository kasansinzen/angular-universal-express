import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ProductService } from "src/app/core/http/product/product.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SweetalertService } from "src/app/core/services/sweetalert.service";

@Component({
  selector: 'app-form-product-type',
  templateUrl: './form-product-type.component.html',
  styleUrls: ['./form-product-type.component.scss']
})
export class FormProductTypeComponent implements OnInit {
  @Input('form-type') formType: string;
  @Input('producttype-id') productTypeId: string | number;
  @Input('producttype-name') productTypeName: string;

  // Dialog
  dataDialog: string;
  // Basic
  btnSubmitName: string;
  productTypeFormGroup: FormGroup;
  isDisabled: boolean = false;
  

  constructor(
    private dialogRef: MatDialogRef<FormProductTypeComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private sweetalertService: SweetalertService
  ) {
    this.formType = data.formType ? data.formType : this.formType;
    this.productTypeId = data.id ? data.id : this.productTypeId;
    this.productTypeName = data.productTypeName ? data.productTypeName : this.productTypeName;

    this.productTypeFormGroup = this.formBuilder.group({
      productTypeName: [this.productTypeName, Validators.required]
    });
  }

  ngOnInit() {
    this.btnSubmitName = this.formType ? this.formType : "Save";
  }

  handleSubmitProductType(event) {
    this.isDisabled = true;
    let requests = {product_type_name: this.productTypeFormGroup.get('productTypeName').value};
    let onDone = () => this.isDisabled = false;
    switch(this.formType){
      case "add":
        this.productService.addProductType(requests).subscribe(result => {
          let status = result['status'] == 200;
          let alert = result['status'] == 200 ? "Success, Data Product Typed Added" : "Failed, Can't Add Data Product Type";
    
          this.sweetalertService.swalToastAlert(status, alert, onDone)
        });
        break;
      case "edit":
        // requests = {...requests, id: this.productTypeId};
        this.productService.editProductType({...requests, id: this.productTypeId}).subscribe(result => {
          let status = result['status'] == 200;
          let alert = result['status'] == 200 ? "Success, Data Product Typed Edited" : "Failed, Can't Add Data Product Type";
    
          this.sweetalertService.swalToastAlert(status, alert, onDone)
        });
        break;
    }
  }

}
