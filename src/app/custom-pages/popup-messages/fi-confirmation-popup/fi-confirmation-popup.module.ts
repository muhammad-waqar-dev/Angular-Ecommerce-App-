import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FIConfirmationPopupComponent } from './fi-confirmation-popup.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FIConfirmationPopupComponent],
  exports: [FIConfirmationPopupComponent]
})
export class FIConfirmationPopupModule { }
