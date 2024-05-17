import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { IconModule, ItemCounterModule, MediaModule, OutletModule, PromotionsModule, SpinnerModule, LaunchDialogModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartpageItemListModule } from './cartpage-item-list/cartpage-item-list.module';
import { CartCouponModule, CartItemContextSource } from '@spartacus/cart/base/components';
import { CartItemContext } from '@spartacus/cart/base/root';


@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    BrowserModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    CartpageItemListModule,
    CartCouponModule,
    ReactiveFormsModule,
    NgbModule,
    PromotionsModule,
    I18nModule,
    ItemCounterModule,
    FeaturesConfigModule,
    LaunchDialogModule,
    OutletModule,
  ],
  exports: [CartComponent],
  providers: [CartItemContextSource,
    { provide: CartItemContext, useExisting: CartItemContextSource },]
})
export class CartModule { }
