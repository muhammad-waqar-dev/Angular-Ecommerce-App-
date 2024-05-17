import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CartItemComponent, CartItemContextSource } from '@spartacus/cart/base/components';
import { MultiCartService } from '@spartacus/cart/base/core';
import { CartRemoveEntrySuccessEvent } from '@spartacus/cart/base/root';
import { EventService } from '@spartacus/core';
import { CacheService } from 'src/app/shared/services/cache.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-cartpage-item-list',
  templateUrl: './cartpage-item-list.component.html',
  styleUrls: ['./cartpage-item-list.component.scss']
})
export class CartpageItemListComponent extends CartItemComponent implements OnInit, AfterContentChecked {
  @Input() isReviewOrder: any;
  @Input() reviewDetails: any;
  qtyPrevValue: any;
  constructor(
    protected cartItemContextSource: CartItemContextSource,
    private shareEvents: ShareEvents,
    private cacheService: CacheService,
    private cd: ChangeDetectorRef,
    protected multiCartService: MultiCartService,
    private addCartevents: EventService) {
    super(cartItemContextSource);
  }

  ngOnInit(): void {
    this.qtyPrevValue = this.quantityControl?.value;
  }

  ngAfterContentChecked(): void {
    const cart: any = JSON.parse(localStorage.getItem('spartacus⚿fi-spa⚿cart') || "");
    if (cart && cart?.active && this.qtyPrevValue != this.quantityControl?.value) {
      this.cacheService.cartUpdated();
      this.multiCartService.reloadCart(cart.active);
      this.qtyPrevValue = this.quantityControl.value;
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  removeItemVal(productVal: any, item?: any) {
    this.quantityControl.setValue(0);
    this.quantityControl.markAsDirty();
    this.cacheService.cartUpdated();
    setTimeout(() => {
      this.shareEvents.notificationInfo((productVal || "") + ' Item is removed from cart');
    }, 3000)
    const result = this.addCartevents.get(CartRemoveEntrySuccessEvent);
    result.subscribe((event) => {
      this.shareEvents.notificationInfo((productVal || "") + ' Item is removed from cart');
    });
  }
}
