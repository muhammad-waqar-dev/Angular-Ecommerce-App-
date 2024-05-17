import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartpageItemListComponent } from './cartpage-item-list.component';
import { IconModule, ItemCounterModule, LaunchDialogModule, MediaModule, OutletModule, PromotionsModule, SpinnerModule } from '@spartacus/storefront';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UrlModule, I18nModule, FeaturesConfigModule } from '@spartacus/core';
import { CartCouponModule, CartItemContextSource } from '@spartacus/cart/base/components';
import { CartItemContext } from '@spartacus/cart/base/root';



@NgModule({
  declarations: [CartpageItemListComponent],
  imports: [
    CommonModule,
    BrowserModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    CartCouponModule,
    ReactiveFormsModule,
    NgbModule,
    PromotionsModule,
    I18nModule,
    ItemCounterModule,
    FeaturesConfigModule,
    LaunchDialogModule,
    OutletModule
  ],
  providers: [
    CartItemContextSource,
    { provide: CartItemContext, useExisting: CartItemContextSource },
  ],
  exports: [
    CartpageItemListComponent
  ]

})
export class CartpageItemListModule { }
