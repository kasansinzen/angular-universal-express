import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionService } from "src/app/core/services/function.service";
import { ApiService } from "src/app/core/http/api.service";
import { ProductService } from "src/app/core/http/product/product.service";
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {
  @Input('form-type') formType: string;
  @Input('product-id') productId: string;
  @Output('handle-submit') handleSubmit: EventEmitter<any> = new EventEmitter();
  // Basic
  addProductFormGroup: FormGroup;
  // Editor: ClassicEditor = ClassicEditor;
  btnSubmitName: string;
  // Result
  productResult: object[];
  productTypeMapResult: object[];
  productTypeResult: object[];

  constructor(
    private functionService: FunctionService,
    private resourceService: ApiService,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.addProductFormGroup = this.formBuilder.group({
      productName: ["", Validators.required],
      price: ["", Validators.required],
      qty: ["", Validators.required],
      detail: ["", Validators.required],
      description: ["", Validators.required],
      productTypeId: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.btnSubmitName = this.formType ? this.formType : "Save";
    this.getProductTypes();

    this.productService.getProductDetail(this.productId).subscribe(result => {
      const data = result['data'];
      this.productResult = data;
      this.productTypeMapResult = data['product_type_list'].map(result => result.product_type_id);

      this.addProductFormGroup.setValue({
        productName: this.productResult['product_name'],
        price: this.productResult['price'],
        qty: this.productResult['qty'],
        detail: this.productResult['detail'],
        description: this.productResult['description'],
        productTypeId: this.productTypeMapResult
      });
    });
  }

  getProductTypes(requests: object = {}) {
    this.resourceService.productTypeListQuery(requests).subscribe(result => {
      this.productTypeResult = result['data'];
    });
  }

  handleSubmitProduct(event) {
    let requests = {
      product_name: this.addProductFormGroup.get('productName').value,
      price: this.addProductFormGroup.get('price').value,
      qty: this.addProductFormGroup.get('qty').value,
      detail: this.addProductFormGroup.get('detail').value,
      description: this.addProductFormGroup.get('description').value,
      product_type_id: this.addProductFormGroup.get('productTypeId').value
    };
    console.log("requests", requests)
    switch(this.formType){
      case "add":
        this.productService.addProductRecord(requests);
        break;
      case "edit":
        requests['id'] = this.productId;
        this.productService.editProductRecord(requests, this.productId);
        break;
    }
  }
  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

}
