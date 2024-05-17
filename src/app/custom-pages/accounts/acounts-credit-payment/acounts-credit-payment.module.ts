import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsCreditPaymentComponent } from './acounts-credit-payment.component';
import { SpinnerModule } from '@spartacus/storefront';
@NgModule({
  declarations: [AccountsCreditPaymentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
  ],
  exports: [AccountsCreditPaymentComponent],
  providers: []
})
export class AccountsCreditPaymentModule { }
