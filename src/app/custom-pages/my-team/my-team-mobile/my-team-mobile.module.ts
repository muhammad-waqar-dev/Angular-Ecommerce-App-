import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamMobileComponent } from './my-team-mobile.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IconModule, ItemCounterModule, ListNavigationModule, MediaModule, OutletModule, SpinnerModule, StarRatingModule } from '@spartacus/storefront';
import { MyTeamItemGridModule } from '../my-team-item-grid/my-team-item-grid.module';
import { RouterModule } from '@angular/router';
import { UrlModule, FeaturesConfigModule } from '@spartacus/core';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';

@NgModule({
  imports: [
    CommonModule,
    SpinnerModule,
    InfiniteScrollModule,
    RouterModule,
    MediaModule,
    AddToCartModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    StarRatingModule,
    IconModule,
    FeaturesConfigModule,
    OutletModule,
    MyTeamItemGridModule
  ],
  declarations: [MyTeamMobileComponent],
  exports: [MyTeamMobileComponent]
})
export class MyTeamMobileModule { }
