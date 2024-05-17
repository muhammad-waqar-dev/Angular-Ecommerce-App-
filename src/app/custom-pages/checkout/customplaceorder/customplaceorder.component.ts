import { Component, OnInit, Output } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { productDisclaimr } from 'src/app/core/constants/general';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { UserService } from '@spartacus/core';
import { ActiveCartService } from '@spartacus/cart/base/core';

@Component({
  selector: 'app-customplaceorder',
  templateUrl: './customplaceorder.component.html',
  styleUrls: ['./customplaceorder.component.scss']
})
export class CustomplaceorderComponent implements OnInit {

  deliveryForm: UntypedFormGroup;
  paymentMethodForm: UntypedFormGroup;
  pickupForm: UntypedFormGroup;
  searchALL: string = 'delivery';
  paymentMethod: string = 'credit-account';
  fiOrderNum: any;
  selectedExistingShipName: any = {};
  isReviewOrder: boolean = false;
  reviewDetails: any;
  isPayForYourOrder: boolean = false;
  isOrderSummaryExpanded: boolean = false;
  isFulfilment: boolean = false;
  isMobile: boolean = false;
  productDisclaimr =  productDisclaimr;

  constructor(
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private router: Router,
    private placeOrderService: PlaceOrderService,
    private paymentService: PaymentService,
    private cartService: ActiveCartService
  ) { }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': '', // enter if exists
    'pageType': 'Place Order',
    'isLoggedIn': 'Yes'
    });
    document.querySelector('body').classList.add('appScaleLevel');
    this.isMobile = CommonUtils.isMobile();
    this.formInit();

  }

  formInit() {
    this.paymentMethodForm = this.fb.group({
      paymentMethod: new UntypedFormControl('ACCOUNT'),
      FIorderNo: new UntypedFormControl('CARD'),
    });
    this.shareEvents.selectedPaymentAccountType = 'ACCOUNT';
  }

  deliveryOption() {
    if(this.reviewDetails && this.reviewDetails.totalPrice.value){
      this.reviewDetails.totalPrice.value = 0
    }
     
    this.isReviewOrder = false;
  }

  reviewOrder(reviewInfo) {
    this.isReviewOrder = true;
    this.reviewDetails = reviewInfo;
  }

  priceChange(e) {

  }

  onPayForYourOrder() {
    this.isPayForYourOrder = !this.isPayForYourOrder;
    this.paymentMethodForm.controls.FIorderNo.setValue(this.reviewDetails.code);
  }

  onOrderSummaryExpanded() {
    this.isOrderSummaryExpanded = !this.isOrderSummaryExpanded;
  }

  onFulfilment() {
    this.isFulfilment = !this.isFulfilment;
  }

  paymentType(name) {
    this.shareEvents.selectedPaymentAccountType = name;
  }

  onPlaceMyOrder() {
    if(this.shareEvents.selectedPaymentAccountType == 'CARD') {
      //this.orderConfirmation();
      let cartId: string ='';
      
      this.cartService.getActiveCartId().subscribe(data=> {
        cartId = data;
      });
      let data = {
        "paymentType": "CARD",
        "orderNumber": cartId,
        "transactionReference": "",
        "sourceType": ""
      }
      this.paymentService.getTransactionOtp(data).subscribe(resp => {
        
        this.shareEvents.otp = resp;
        this.openPaymentPopup();
      })
      
    }
    else {
    this.router.navigate(['/order-confirmation'])
    }
  }

  // orderConfirmation() {
  //   this.placeOrderService.getChargeToCreditPayment().subscribe((res: any) => {
  //     // getting transaction OTP
  //     if (res?.paymentTransactionInfo) {
  //       // storing OTP to pass to popup
  //       this.shareEvents.otp = res?.paymentTransactionInfo?.transactionOTP;

  //       // if got OTP code, open payment popup 
  //       this.openPaymentPopup();
  //     }
  //     this.shareEvents.orderCode = res.code;
  //   }, (error: any) => {
  //   })
  // }

  openPaymentPopup() {
    this.shareEvents.paymentSubjectSendEvent();
  }

}
