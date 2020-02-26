import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  public swalToastConfig() {
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

  public swalToastAlert(isSuccess: boolean = true, titleAlert: string = "Successfully", onDone: any = () => false) {
    const Toast = this.swalToastConfig();
    Toast.fire({
      icon: isSuccess ? 'success' : 'error',
      title: titleAlert,
      onClose: () => onDone()
    });
  }

  public swalAlert(titleAlert: string = "", textAlert: string = "", iconAlert: SweetAlertIcon) { 
    Swal.fire(titleAlert, textAlert, iconAlert);
  }

  public swalToastLoading(isSuccess: boolean = true, titleAlert: string = "Successfully", onDone: any = () => false) {
    const Toast = this.swalToastConfig();
    Toast.showLoading();
  }

  public swalComfirmAlert(titleAlert: string = "", textAlert: string = "", onConfirmed: any = () => false) {
    Swal.fire({
      title: titleAlert ? titleAlert : 'Are you sure to Delete',
      text: textAlert,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if(result.value) onConfirmed();
    })
  }
}
