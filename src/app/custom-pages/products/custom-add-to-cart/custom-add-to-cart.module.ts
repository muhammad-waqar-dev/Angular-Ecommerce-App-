import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAddToCartComponent } from './custom-add-to-cart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeaturesConfigModule, UrlModule, I18nModule } from '@spartacus/core';
import { SpinnerModule, PromotionsModule, IconModule, ItemCounterModule, KeyboardFocusModule, LaunchDialogModule } from '@spartacus/storefront';
import { AddedToCartDialogModule, CartSharedModule } from '@spartacus/cart/base/components';
import { CartAddEntrySuccessEvent } from '@spartacus/cart/base/root';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';



@NgModule({
  declarations: [CustomAddToCartComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CartSharedModule,
    RouterModule,
    SpinnerModule,
    PromotionsModule,
    FeaturesConfigModule,
    UrlModule,
    IconModule,
    I18nModule,
    ItemCounterModule,
    KeyboardFocusModule,
    LaunchDialogModule,
    AddToCartModule,
    AddedToCartDialogModule
  ],
  exports: [
    CustomAddToCartComponent
  ],
  providers: [
    CartAddEntrySuccessEvent
  ]
})
export class CustomAddToCartModule { }
