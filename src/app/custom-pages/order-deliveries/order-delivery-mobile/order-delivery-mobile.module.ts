import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDeliveryMobileComponent } from './order-delivery-mobile.component';
import { OrderDeliveryItemGridModule } from '../order-delivery-item-grid/order-delivery-item-grid.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListNavigationModule } from '@spartacus/storefront';
import { OrderDeliveryItemListModule } from '../order-delivery-item-list/order-delivery-item-list.module';
import { OrderDeliveryDetailsModule } from '../order-delivery-details/order-delivery-details.module';

@NgModule({
  imports: [
    CommonModule,
    OrderDeliveryItemGridModule,
    OrderDeliveryItemListModule,
    OrderDeliveryDetailsModule,
    InfiniteScrollModule,
    ListNavigationModule
  ],
  declarations: [OrderDeliveryMobileComponent],
  exports: [OrderDeliveryMobileComponent]
})
export class OrderDeliveryMobileModule { }
