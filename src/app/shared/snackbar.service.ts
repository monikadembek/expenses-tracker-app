import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMessageType } from './shared-models';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  successClass = 'success-snackbar';
  warningClass = 'warning-snackbar';

  constructor(private snackbar: MatSnackBar) { }

  displaySnackbarMessage(message: string, type: SnackbarMessageType = SnackbarMessageType.Success): void {
    let typeClass = '';
    switch (type) {
      case SnackbarMessageType.Success:
        typeClass = this.successClass;
        break;
      case SnackbarMessageType.Warning:
        typeClass = this.warningClass;
        break;
      default:
        typeClass = this.successClass;
    }

    this.snackbar.open(message, 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3500,
      panelClass: ['custom-snackbar', typeClass]
    } );
  }
}
