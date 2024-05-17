import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { AccountsDetailsComponent } from './accounts-details.component';
import { DisputeInvoicePopupComponent } from './dispute-invoice-popup/dispute-invoice-popup.component';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';
import { PayInvoicePopupComponent } from './pay-invoice-popup/pay-invoice-popup.component';
import { RequestForPodPopupComponent } from './request-for-pod-popup/request-for-pod-popup.component';
import { PaymentIframeModule } from 'src/app/shared/components/payment-iframe/payment-iframe.module';

@NgModule({
  declarations: [AccountsDetailsComponent, DisputeInvoicePopupComponent, PayInvoicePopupComponent, RequestForPodPopupComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FIConfirmationPopupModule,
    PaymentIframeModule
  ],
  exports: [AccountsDetailsComponent, PayInvoicePopupComponent],
})
export class AccountsDetailsModule { }
