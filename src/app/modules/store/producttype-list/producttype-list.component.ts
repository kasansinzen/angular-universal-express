import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/core/http/api.service";
import { ProductService } from "src/app/core/http/product/product.service";
import { SweetalertService } from "src/app/core/services/sweetalert.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormProductTypeComponent } from "src/app/shared/components/form-product-type/form-product-type.component";

@Component({
  selector: 'app-producttype-list',
  templateUrl: './producttype-list.component.html',
  styleUrls: ['./producttype-list.component.scss']
})
export class ProducttypeListComponent implements OnInit {

  productTypeResult: object[];
  onLoadProductType: any;

  constructor(
    private resourceService: ApiService,
    private productService: ProductService,
    private sweetalertService: SweetalertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getProductTypes();
    // this.onLoadProductType = () => this.getProductTypes;
  }

  getProductTypes() {
    this.productService.getProductTypeList().subscribe(result => this.productTypeResult = result['data']);
  }
  
  handleClickOpenFormProductTypeDialog(event, formType: string, id: string | number = "", productTypeName: string = "") {
    event.preventDefault();
    const dialogRef = this.dialog.open(FormProductTypeComponent, {
      data: {formType, id, productTypeName}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getProductTypes();
    });
  }
  handleClickDestroyProductType(event, id: number | string) {
    console.log("event", event);
    console.log("id", id);
    let onDestroyed = () => {
      this.productService.destroyProductType({id}).subscribe(result => {
        if(result['status'] == 200){
          this.sweetalertService.swalAlert("Deleted!", "Your file has been deleted.", 'success');
          this.getProductTypes();
        }else{
          this.sweetalertService.swalAlert("Can't Delete", "Found some problems, Please retry again", 'error');
        }
      })
    }
    this.sweetalertService.swalComfirmAlert("Are you sure to Delete", "", onDestroyed)
  }
}
