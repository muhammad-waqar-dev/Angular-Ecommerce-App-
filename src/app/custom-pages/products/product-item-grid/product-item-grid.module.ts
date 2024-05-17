import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemGridComponent } from './product-item-grid.component';

import { CmsConfig, ConfigModule, FeaturesConfigModule, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { IconModule, ItemCounterModule, ListNavigationModule, MediaModule, OutletModule, PageLayoutService, ProductGridItemComponent, ProductListItemComponent, ProductListModule, SpinnerModule, StarRatingModule, ViewConfig } from '@spartacus/storefront';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomAddToCartModule } from '../custom-add-to-cart/custom-add-to-cart.module';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';


@NgModule({
  declarations: [ProductItemGridComponent],
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    AddToCartModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    StarRatingModule,
    IconModule,
    SpinnerModule,
    InfiniteScrollModule,
    FeaturesConfigModule,
    OutletModule,
    CustomAddToCartModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductGridComponent: {
          component: ProductItemGridComponent
        }
      }
    } as CmsConfig)
  ],
  exports: [ProductItemGridComponent],
  providers: [
    PageLayoutService]
})
export class ProductItemGridModule { }
