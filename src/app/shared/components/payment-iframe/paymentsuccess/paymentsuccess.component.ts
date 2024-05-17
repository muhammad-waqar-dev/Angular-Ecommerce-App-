import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.scss']
})
export class PaymentsuccessComponent implements OnInit {

  @ViewChild('paymentServiceModal', { static: true }) paymentServiceModal;

  constructor(
    private paymentService: PaymentService, 
    private shareEvents: ShareEvents,
    private placeOrderService: PlaceOrderService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    let parentURL = window.top.location.href;
    if(parentURL.includes('my-accounts')) {
      this.paymentTransactionDetailsCheck();
    }
    else{
      console.log('Payment Success Component');
      this.shareEvents.paymentStatus = 'success';
      sessionStorage.setItem('payStatus', 'success');
      
    }
  }
  paymentTransactionDetailsCheck() {
    this.paymentService.getAccountTransactionDetail(sessionStorage.getItem("transOTP")).subscribe((transactionData) => {
      sessionStorage.removeItem("transOTP");
    });
  }

}
