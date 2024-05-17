import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconModule, ItemCounterModule, ListNavigationModule, MediaModule, OutletModule, PageLayoutService, SpinnerModule, StarRatingModule } from '@spartacus/storefront';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProductsMobileComponent } from './products-mobile.component';
import { FeaturesConfigModule, UrlModule } from '@spartacus/core';
import { ProductItemGridModule } from '../product-item-grid/product-item-grid.module';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';



@NgModule({
  declarations: [ProductsMobileComponent],
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    AddToCartModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    StarRatingModule,
    IconModule,
    SpinnerModule,
    InfiniteScrollModule,
    FeaturesConfigModule,
    OutletModule,
    ProductItemGridModule
  ],
  exports: [ProductsMobileComponent],
  providers: [
    PageLayoutService
  ]
})
export class ProductsMobileModule { }
