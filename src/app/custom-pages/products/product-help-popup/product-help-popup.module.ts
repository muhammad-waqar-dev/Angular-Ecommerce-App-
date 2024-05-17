import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductHelpPopupComponent } from './product-help-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FIConfirmationPopupModule
  ],
  exports:[ProductHelpPopupComponent],
  declarations: [ProductHelpPopupComponent]
})
export class ProductHelpPopupModule { }
