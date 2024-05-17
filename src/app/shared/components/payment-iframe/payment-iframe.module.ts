import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentIframeComponent } from './payment-iframe.component';
import { PaymentsuccessComponent } from './paymentsuccess/paymentsuccess.component';
import { PaymentfailureComponent } from './paymentfailure/paymentfailure.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { url } from 'inspector';

@NgModule({
  declarations: [
    PaymentIframeComponent,
    PaymentsuccessComponent,
    PaymentfailureComponent
  ],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        FIDatacomPaymentSuccessFlexComponent: {
          component: PaymentsuccessComponent,
        },
        FIDatacomPaymentFailureFlexComponent: {
          component: PaymentfailureComponent,
        },
      },
    } as CmsConfig)
  ],
  exports:
  [
    PaymentIframeComponent
  ]
})
export class PaymentIframeModule { }
