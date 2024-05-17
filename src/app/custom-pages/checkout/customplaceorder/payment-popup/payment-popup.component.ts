import { popupThankYouMessage } from 'src/app/core/constants/general';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, of } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service'
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { Router } from '@angular/router';
import { ConfiguratorConflictSolverDialogLauncherService } from '@spartacus/product-configurator/rulebased';
import { async } from '@angular/core/testing';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';

@Component({
  selector: 'app-payment-popup',
  templateUrl: './payment-popup.component.html',
  styleUrls: ['./payment-popup.component.scss']
})
export class PaymentPopupComponent implements OnInit {
  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  selectedAccount: any;
  popupThankYouMessage = popupThankYouMessage;
  private user$: Observable<User | undefined>
  private subscription = new Subscription();
  isMobile: boolean = CommonUtils.isMobile();
  
  @ViewChild('paymentServiceModal', { static: true }) paymentServiceModal;
  @Input('isShow') isShow: boolean;

  constructor(private modalService: NgbModal,
    private shareEvents: ShareEvents,
    private accountDropDownStateService: AccountDropDownStateService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,
    private router: Router,
    private paymentService: PaymentService,
    private placeOrderService: PlaceOrderService,
  ) {
      this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    
    // Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.paymentSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));

  }
  placeOrder() {
    this.placeOrderService.getChargeToCreditPayment().subscribe((res: any) => {
      // getting transaction OTP
      
      this.shareEvents.orderCode = res.code;
      this.router.navigate(['/order-confirmation'])
    }, (error: any) => {
    })
  }

  onPopupOpenClick() {
    this.shareEvents.paymentSubjectSendEvent();
  }

   openPopup() {
    // added status isReceived to check if true then popup will be opened 
    if (this.isShow) {
      
      this.modalService
        .open(this.paymentServiceModal, { centered: true, windowClass: 'paymentForm', size: 'lg' });

        
        // .result.then(
        //   (result) => {
        //     this.resetAndCloseForm();
        //     this.router.navigate(['/order-confirmation'])
        //   },
        //   (reason) => {
        //     console.log(reason);
        //       this.resetAndCloseForm();
        //       this.router.navigate(['/order-confirmation'])
        //       setTimeout(() => {
        //         window.scroll(0, 0);
        //       }, 100);
            
        //   }
        // );
    } else {
      // do nothing
    }
  }

  resetAndCloseForm() {
    console.log('popup close');
    this.responseOpen = true;
    this.modalService.dismissAll();
    let payStatus = sessionStorage.getItem('payStatus');
    console.log(sessionStorage.getItem('payStatus'));
    if(payStatus === 'success')
    {
      sessionStorage.removeItem('payStatus');
      this.placeOrder();
    }
    else if (payStatus === 'failed' || payStatus === '')
    {
      sessionStorage.removeItem('payStatus');
      this.router.navigate(['/cart']);
    }
  }
}
