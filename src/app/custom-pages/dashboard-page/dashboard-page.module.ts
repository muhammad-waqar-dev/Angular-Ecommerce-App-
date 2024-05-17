import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { AccountsCreditPaymentModule } from '../accounts/acounts-credit-payment/acounts-credit-payment.module';
import { WhyFIModule } from '../whyfi/whyfi.module';
import { DashboardOrderDeliveryItemGridModule } from './dashboard-order-delivery-item-grid/dashboard-order-delivery-item-grid.module';
import { DashboardQuoteItemGridModule } from './dashboard-quote-item-grid/dashboard-quote-item-grid.module';
import { QuoteDetailsModule } from '../quotes/quote-details/quote-details.module';
import { OrderDeliveryDetailsModule } from '../order-deliveries/order-delivery-details/order-delivery-details.module';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,
    AccountsCreditPaymentModule,
    WhyFIModule,
    DashboardOrderDeliveryItemGridModule,
    DashboardQuoteItemGridModule,
    QuoteDetailsModule,
    OrderDeliveryDetailsModule
  ],
  providers: [
    DashboardService
  ],
  exports: [DashboardPageComponent]
})
export class DashboardPageModule { }
