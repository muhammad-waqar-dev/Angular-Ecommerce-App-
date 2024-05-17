import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderDeliveryDetailsComponent } from './order-delivery-details.component';
import { ChangeOrderPopupComponent } from './change-order-popup/change-order-popup.component';
import { SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';
import { RequestForPodPopupComponent } from './request-for-pod-popup/request-for-pod-popup.component';



@NgModule({
  declarations: [OrderDeliveryDetailsComponent, ChangeOrderPopupComponent, RequestForPodPopupComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FIConfirmationPopupModule
  ],
  exports: [OrderDeliveryDetailsComponent],
})
export class OrderDeliveryDetailsModule { }
