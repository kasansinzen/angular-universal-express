import { Injectable } from '@angular/core';
import { FunctionService } from "src/app/core/services/function.service";
import { ApiService } from "src/app/core/http/api.service";
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  adminUrl: any;

  constructor(
    private resourceService: ApiService,
    private functionService: FunctionService,
    private router: Router
  ) {
    this.adminUrl = this.functionService.adminUrl;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  
  private swalToastConfig = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    return Toast;
  }

  public getProductList = (requests: object = {}): Observable<any> => {
    return this.resourceService.productListQuery(requests);
  }

  public getProductDetail = (id: number | string): Observable<any> => {
    return this.resourceService.productDetailQuery({id});
  }

  public getProductTypeList = (requests: object = {}): Observable<any> => {
    return this.resourceService.productTypeListQuery(requests);
  }

  public getProductAlbum = (id: number | string): Observable<any> => {
    return this.resourceService.productAlbumQuery({id});
  }

  public removeImageProduct = (id: number | string): Observable<any> => {
    return this.resourceService.removeImagePoductQuery({id});
  }

  public setProfileProduct = (id: number | string, productAlbumId: number | string): Observable<any> => {
    return this.resourceService.setProfilePoductQuery({id, profile_id: productAlbumId});
  }

  public addProductType = (requests: object): Observable<any> => {
    return this.resourceService.addProductTypeQuery(requests);
  }

  public editProductType = (requests: object): Observable<any> => {
    return this.resourceService.editProductTypeQuery(requests);
  }

  public destroyProductType = (requests: object): Observable<any> => {
    return this.resourceService.destroyProductTypeQuery(requests);
  }

  public defaultProductImage = (event) => {
    event.target.src = "/assets/images/product/1.jpg";
  }

  public addProductRecord = (requests: object) => {
    this.resourceService.addProductQuery(requests).subscribe(result => {
      const Toast = this.swalToastConfig();

      if (result['status'] == 200) {
        let product_id = result['data']['insertId'];
        Toast.fire({
          icon: 'success',
          title: "Successfully, data Product added",
          onClose: () => {
            this.router.navigate([this.adminUrl(`product/edit/${product_id}`)]);
          }
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: "Error, Can't add data Product"
        })
      }
    }, error => {
      console.log(error)
    });
  }

  public editProductRecord = (requests: object, id: number | string) => {
    this.resourceService.editProductQuery(requests).subscribe(result => {
      const Toast = this.swalToastConfig();

      if (result['status'] == 200) {
        Toast.fire({
          icon: 'success',
          title: "Successfully, data Product edited",
          onClose: () => {
            this.router.navigate([this.adminUrl(`product/edit/${id}`)]);
          }
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: "Error, Can't edit data Product"
        })
      }
    }, error => {
      console.log(error)
    });
  }

  public destroyProductRecord = (id: string | number, name: string) => {
    Swal.fire({
      title: 'Are you sure to Delete',
      text: `Product ID: ${id} | Product Name: ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        return this.resourceService.destroyProductQuery({ id }).subscribe(result => {
          if (result['status'] == 200) {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          } else {
            Swal.fire("Can't Delete", "Found some problems, Please retry again", 'error');
          }
        });
      }
    })
  }

}
