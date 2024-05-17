import { Component, Input, OnInit } from '@angular/core';
import { ShareEvents } from 'src/app/shared/shareEvents.service'
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-iframe',
  templateUrl: './payment-iframe.component.html',
  styleUrls: ['./payment-iframe.component.scss']
})
export class PaymentIframeComponent implements OnInit {
  
  paymentIframeURL: any = '';

  constructor(
    private shareEvents: ShareEvents,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.generateIframeURL();
    //this.router.navigate(['/payment-failed'])
    //this.router.navigate(['/payment-successful'])
  }

  generateIframeURL() {
    // preparing URL with Transaction OTP
    this.paymentIframeURL = `${environment.paymentURL}?TransactionId=${this.shareEvents.otp}`;

    // sanitizing payment iframe URL Endpoints using DomSanitizer 
    this.paymentIframeURL= this.sanitizer.bypassSecurityTrustResourceUrl(this.paymentIframeURL);
  }

}
