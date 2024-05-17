import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { delay } from 'rxjs/operators';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paymentfailure',
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.scss']
})
export class PaymentfailureComponent implements OnInit {
  otpObj: any;

  @ViewChild('paymentServiceModal', { static: true }) paymentServiceModal;
  constructor(
    private paymentService: PaymentService, 
    private shareEvents: ShareEvents,
    private router: Router,

    ) { }

  ngOnInit(): void {
    let parentURL = window.top.location.href;
    if(parentURL.includes('my-accounts')) {
        this.transactionDetail();
    }
    else{
      console.log('Payment Failed Component');
      this.shareEvents.paymentStatus = 'failed';
      sessionStorage.setItem('payStatus', 'failed');
    }
  }
  
  transactionDetail() {
    this.paymentService.getAccountTransactionDetail(sessionStorage.getItem("transOTP")).subscribe((transactionData) => {
      sessionStorage.removeItem("transOTP");
    });
  }

}
