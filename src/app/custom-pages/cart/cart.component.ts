import {  ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { UserIdService } from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { productDisclaimr } from 'src/app/core/constants/general';
import { OrderEntry } from '@spartacus/cart/base/root';
import { ActiveCartService, MultiCartService, SelectiveCartService } from '@spartacus/cart/base/core';
import { CartItemContextSource, CartItemListComponent } from '@spartacus/cart/base/components';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent extends CartItemListComponent implements OnInit, OnChanges {
  entries$: Observable<OrderEntry[]>;
  form: UntypedFormGroup = new UntypedFormGroup({});
  customUserId: any;
  isLoading$ = new BehaviorSubject<boolean>(true);
  userIdVal: string;
  productDisclaimr = productDisclaimr;
  @Input() isReviewOrder: any;
  @Input() reviewDetails: any;
  constructor(protected activeCartService: ActiveCartService,
    private placeOrderService: PlaceOrderService,
    protected cartItemContextSource: CartItemContextSource,
    protected selectiveCartService: SelectiveCartService,
    protected userIdService: UserIdService,
    protected multiCartService: MultiCartService,
    protected cd: ChangeDetectorRef,
    private shareEvents: ShareEvents) {

    super(activeCartService, selectiveCartService, userIdService, multiCartService, cd);
    this.shareEvents.cartUpdateReceiveEvent().subscribe((data) => {
      this.items = data.entries;
    })
  }
  isMobile = CommonUtils.isMobile();

  products = [];

  ngOnInit(): void {
    this.entries$ = this.activeCartService?.getEntries();
    if (window.location.href.includes('cart')) {
      (<any>window).dataLayer = (<any>window).dataLayer || [];
      (<any>window).dataLayer.push({
        'event': 'Page-Details', //constant value
        'currentURL': window.location.href, // page url
        'currentPageTitle': 'Your Shopping Cart', // enter if exists
        'pageType': 'Cart',
        'isLoggedIn': 'Yes'
      });
    }
    this.cartItemList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.entries$?.currentValue != changes?.entries$?.previousValue) {
      this.entries$.subscribe(data => {
        this.items = data;
        this.cd.detectChanges();
        this.cd.markForCheck();
      });
    }
  }

  cartItemList() {
    this.userIdService
      ?.getUserId()
      .subscribe((userId) => (this.userIdVal = userId));
    if (this.entries$) {
      this.isLoading$.next(true);
      this.entries$.subscribe(data => {
        this.items = data;
        this.cd.detectChanges();
        this.cd.markForCheck();
        this.shareEvents.sendCartData(this.items);
        if (this.items.length > 0) {
          this.isLoading$.next(false);
        }
        else {
          setTimeout(() => {
            const cart: any = JSON.parse(localStorage.getItem('spartacus⚿fi-spa⚿cart') || "");
            if (cart && cart?.active) {
              this.multiCartService.reloadCart(cart.active);
              this.cd.detectChanges();
              this.cd.markForCheck();
              setTimeout(() => {
                this.isLoading$.next(false);
              }, 1000);
            } else {
              this.isLoading$.next(false);
            }

          }, 2000);
        }
      })
    }
  }
}
