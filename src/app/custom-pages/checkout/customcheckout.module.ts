import { CartNotEmptyGuard } from '@spartacus/checkout/base/components';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CmsConfig, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { IconModule, ItemCounterModule, LaunchDialogModule, MediaModule, OutletModule, SpinnerModule } from '@spartacus/storefront';
import { orderStepGaurd } from 'src/app/core/guard/orderStepGaurd';
import { PaymentIframeModule } from 'src/app/shared/components/payment-iframe/payment-iframe.module';
import { NgbDateCustomParserFormatter } from '../../shared/services/ngDateParserFormatter.service';
import { CartModule } from '../cart/cart.module';
import { CustomplaceorderComponent } from './customplaceorder/customplaceorder.component';
import { PaymentPopupComponent } from './customplaceorder/payment-popup/payment-popup.component';
import { OrderDeliverySectionComponent } from './order-delivery-section/order-delivery-section.component';
import { OrderPickupSectionComponent } from './order-pickup-section/order-pickup-section.component';
import { OrderconfirmationComponent } from './orderconfirmation/orderconfirmation.component';

@NgModule({
  declarations: [CustomplaceorderComponent, OrderDeliverySectionComponent, OrderPickupSectionComponent, OrderconfirmationComponent, PaymentPopupComponent],
  imports: [
    CommonModule,
    BrowserModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    I18nModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule,
    ItemCounterModule,
    CartModule,
    LaunchDialogModule,
    OutletModule,
    PaymentIframeModule
  ],
  providers: [
    DatePipe,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        FBPlaceOrderComponent: {
          component: CustomplaceorderComponent,
          guards: [CartNotEmptyGuard]
        },
        FBOrderConfirmationComponent: {
          component: OrderconfirmationComponent,
          guards: [CartNotEmptyGuard, orderStepGaurd]
        },
      },
      provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter
    }),
  ],
  exports: [CustomplaceorderComponent, OrderconfirmationComponent]
})
export class CustomcheckoutModule { }
