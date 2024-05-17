import { CartItemContextSource } from '@spartacus/cart/base/components';
import { MiniCartComponent, MiniCartComponentService } from '@spartacus/cart/base/components/mini-cart';
import { Component, ElementRef, OnInit } from '@angular/core';
import { UserIdService } from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonUtils } from 'src/app/core/utils/utils';
import { CartpageItemListComponent } from 'src/app/custom-pages/cart/cartpage-item-list/cartpage-item-list.component';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { OrderEntry } from '@spartacus/cart/base/root';
import { ActiveCartService, MultiCartService, SelectiveCartService } from '@spartacus/cart/base/core';
import { CacheService } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-custom-mini-cart',
  templateUrl: './custom-mini-cart.component.html',
  styleUrls: ['./custom-mini-cart.component.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class CustomMiniCartComponent extends MiniCartComponent implements OnInit {
  entries$: Observable<OrderEntry[]>;
  isMobile = CommonUtils.isMobile();
  isShowMenu = false;
  isCartEmpty$ = new BehaviorSubject<boolean>(false);
  items: any = [];

  constructor(private _eref: ElementRef,
    private activeCartService: ActiveCartService,
    protected cartItemContextSource: CartItemContextSource,
    protected selectiveCartService: SelectiveCartService,
    protected userIdService: UserIdService,
    protected multiCartService: MultiCartService,
    private cacheService: CacheService,
    private shareEvents: ShareEvents,
    protected miniCartComponentService: MiniCartComponentService
  ) {

    super(miniCartComponentService);
    if (!this.cacheService.getIsUpdated()) {
      this.shareEvents.cartUpdateReceiveEvent().subscribe((data) => {
        this.quantity$ = data.entries.length;
        this.isCartEmpty$.next(false);
      })
    }
  }

  ngOnInit() {
    this.entries$ = this.activeCartService?.getEntries();
    if (this.entries$) {
      this.cacheService.cartUpdated();
      this.entries$.subscribe(data => {
        if (data.length == 0) {
          this.isCartEmpty$.next(false);
        } else {
          this.isCartEmpty$.next(true);
        }
        data.forEach(n => {
          this.items.push(n)
        })
      })

    }
  }

  toggleMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  onClickOutside(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isShowMenu = false;
    }
  }
}
