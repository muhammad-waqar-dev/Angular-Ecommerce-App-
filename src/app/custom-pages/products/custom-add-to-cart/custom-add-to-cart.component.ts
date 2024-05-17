import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AddToCartComponent } from '@spartacus/cart/base/components/add-to-cart';
import { ActiveCartService, MultiCartService } from '@spartacus/cart/base/core';
import { CartAddEntrySuccessEvent } from '@spartacus/cart/base/root';
import { CmsAddToCartComponent, EventService } from '@spartacus/core';
import { CategoryPageResultsEvent, CmsComponentData, CurrentProductService, LaunchDialogService } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services/cache.service';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-custom-add-to-cart',
  templateUrl: './custom-add-to-cart.component.html',
  styleUrls: ['./custom-add-to-cart.component.scss']
})
export class CustomAddToCartComponent extends AddToCartComponent {
  addingText = new BehaviorSubject<boolean>(false);
  isInternStaff = new BehaviorSubject<boolean>(false);
  numberOfEntriesBeforeAdd: number;
  constructor(protected modalService: LaunchDialogService,
    protected currentProductService: CurrentProductService,
    protected activeCartService: ActiveCartService,
    protected cdVal: ChangeDetectorRef,
    private shareEvents: ShareEvents,
    protected multiCartService: MultiCartService,
    private placeOrderService: PlaceOrderService,
    private cacheService: CacheService,
    component: CmsComponentData<CmsAddToCartComponent>,
    private addCartevents: EventService) {
    super(currentProductService, cdVal, activeCartService, component, addCartevents)
    if (sessionStorage.getItem('internalUserState') == 'false') {
      this.isInternStaff.next(true);
    }
  }

  addToCart() {
    const quantity = this.addToCartForm.get('quantity').value;
    if (!this.productCode || quantity <= 0) {
      return;
    }
    this.activeCartService
      .getEntries()
      .pipe(take(1))
      .subscribe((entries) => {
        this.numberOfEntriesBeforeAdd = entries.length;
        this.cacheService.cartUpdated();
        this.activeCartService.addEntry(this.productCode, quantity);
        this.addingText.next(true);
        const result$ = this.addCartevents.get(CartAddEntrySuccessEvent);
        result$.subscribe((event) => {
          setTimeout(() => {
            this.addingText.next(false);
          }, 1000);
        });
        setTimeout(() => {
          const cart: any = JSON.parse(localStorage.getItem('spartacus⚿fi-spa⚿cart') || "");
          if (cart && cart?.active) {
            this.multiCartService.reloadCart(cart.active);
           
            this.cd.detectChanges();
            this.cd.markForCheck();
          }
        }, 1000);
      });
  }
}
