import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDeliveriesComponent } from './order-deliveries.component';
import { OrderDeliveryItemGridModule } from './order-delivery-item-grid/order-delivery-item-grid.module';
import { OrderDeliveriesFiltersModule } from './order-deliveries-filters/order-deliveries-filters.module';
import { OrderDeliveriesFiltersComponent } from './order-deliveries-filters/order-deliveries-filters.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IconModule, PaginationModule, SpinnerModule, ViewConfig } from '@spartacus/storefront';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { OrderDeliveryMobileModule } from './order-delivery-mobile/order-delivery-mobile.module';
import { OrderDeliveriesSearchModule } from './order-deliveries-search/order-deliveries-search.module';
import { OrderDeliveryItemListModule } from './order-delivery-item-list/order-delivery-item-list.module';
import { OrderDeliveryDetailsModule } from './order-delivery-details/order-delivery-details.module';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { GlobalsortpipeModule } from 'src/app/shared/pipes/globalsortpipe.module';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';


@NgModule({
  declarations: [
    OrderDeliveriesComponent,
    OrderDeliveriesFiltersComponent,
  ],
  imports: [
    CommonModule,
    GlobalsortpipeModule,
    OrderDeliveryItemGridModule,
    OrderDeliveriesFiltersModule,
    OrderDeliveryItemListModule,
    SpinnerModule,
    IconModule,
    PaginationModule,
    InfiniteScrollModule,
    OrderDeliveryMobileModule,
    OrderDeliveriesSearchModule,
    OrderDeliveryDetailsModule,
    AccesspermissionmessageModule,
    ConfigModule.withConfig({
      pagination: {
        addPrevious: true,
        addStart: false,
        addNext: true,
        addEnd: false
      }
    }),
  ],
  providers: [
    OrderDeliveryService,
    provideConfig(<ViewConfig>{
      view: {
        infiniteScroll: {
          active: CommonUtils.isMobile(),
          showMoreButton: false
        }
      }
    }),
   
  ]
})
export class OrderDeliveriesModule { }
