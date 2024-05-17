import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemComponent, CartItemContextSource } from '@spartacus/cart/base/components';
import { ActiveCartService } from '@spartacus/cart/base/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { orderConfirmation, orderDeliveriesConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-orderconfirmation',
  templateUrl: './orderconfirmation.component.html',
  styleUrls: ['./orderconfirmation.component.scss']
})
export class OrderconfirmationComponent extends CartItemComponent  implements OnInit, OnDestroy {
  private subscription = new Subscription();
  isLoading$ = new BehaviorSubject<boolean>(true);
  orderSummaryData: any;
  placeOrderErrorMessage: any;
  errorMessageShow: boolean = false;
  orderConfirmation = orderConfirmation;
  orderDeliveriesConstants = orderDeliveriesConstants;
  isMobile: boolean = false;
  constructor(protected activeCartService: ActiveCartService,
    private placeOrderService: PlaceOrderService,
    private shareEvents: ShareEvents,
    private router: Router,
    protected cartItemContextSource: CartItemContextSource,) {
    super(cartItemContextSource);
  }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'event': 'Page-Details', //constant value
      'currentURL': window.location.href, // page url
      'currentPageTitle': 'Order Confirmation', // enter if exists
      'pageType': 'Order Confirmation',
      'isLoggedIn': 'Yes'
    });
    this.isMobile = CommonUtils.isMobile();
    if (this.shareEvents.selectedPaymentAccountType == "CARD") {
      this.placeOrderCard();
    }
    else {
      this.orderConfirm();
    }
  }

  placeOrderCard() {
    this.isLoading$.next(true);
    this.subscription.add(this.placeOrderService.getCardPaymentDetails().subscribe((data) => {
      this.orderSummaryData = data;
      this.shareEvents.checkDeliveryData = [];
      this.isLoading$.next(false);
      this.cartEmpty();
      this.shareEvents.orderCode = '';
      this.shareEvents.otp = '';
    }, error => {
      this.placeOrderErrorMessage = error?.error?.errors[0]?.message;
      if (this.placeOrderErrorMessage.includes('Delivery mode is not set')) {
        this.router.navigate(['/'])
      }
      else {
        this.isLoading$.next(false);
      }
    }))
  }

  orderConfirm() {
    this.isLoading$.next(true);
    this.subscription.add(this.placeOrderService.getChargeToCreditPayment().subscribe((data) => {
      this.updateDataLayer(data);
      this.orderSummaryData = data;
      this.shareEvents.checkDeliveryData = [];
      this.isLoading$.next(false);
      this.cartEmpty();
    }, error => {
      this.placeOrderErrorMessage = error?.error?.errors[0]?.message;
      if (this.placeOrderErrorMessage.includes('Delivery mode is not set')) {
        this.router.navigate(['/'])
      }
      else {
        this.isLoading$.next(false);
      }
    }))

  }

  updateDataLayer(data: any) {
    let tempdata = [];
    data.entries.forEach((val: any) => {
      tempdata.push({
        // List of productFieldObjects.
        name: val?.product?.name, // Name
        id: val?.product?.code, //SKU ID
        price: val?.product?.price?.value?.toString(),
        brand: '', //brand of product
        category: val?.product?.categories[0] ? val?.product?.categories[0]?.name : '', //category of product
        variant: '', //variant if any else undefined without quotes
        quantity: val?.quantity?.toString(),
      });
    });
    let productDL = {
      event: 'eec.purchase',
      ecommerce: {
        purchase: {
          actionField: {
            id: data?.code, // Transaction ID. Required for purchases and refunds.
            revenue: data?.totalPriceWithTax?.value?.toString(), // Total transaction value (incl. tax and shipping)
            tax: data?.totalTax?.value?.toString(), //only tax amount
            shipping: '', //only shipping charges
            coupon: '', //If not available send undefined without quotes
          },
          products: tempdata,
        },
      },
    };
    // For Google analytics
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    (<any>window).dataLayer.push(productDL);
  }

  cartEmpty() {
    this.subscription.add(this.placeOrderService.cartEmpty().subscribe((data) => {
      this.shareEvents.cartUpdateSendEvent(data);
      sessionStorage.setItem("orderConfirm", "true")
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
