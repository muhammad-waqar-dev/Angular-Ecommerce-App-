import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { quoteDetailsConstants, homeConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { quoteConstants, genericConstants, dashboardPageConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent implements OnInit {

  @Input('data') data: any;
  @Input('isFromDashboard') isFromDashboard: boolean = false;

  isStatusValid: boolean = false;
  quote: any = {};
  isLoading$ = new BehaviorSubject<boolean>(true);
  quoteDetailsConstants = quoteDetailsConstants;
  homeConstants = homeConstants;
  @Output() navigateQuote: EventEmitter<any> = new EventEmitter();
  isMobile = CommonUtils.isMobile();

  quoteConstants = quoteConstants;
  genericConstants = genericConstants;
  dashboardPageConstants = dashboardPageConstants;

  isInvoiceGen: boolean = false;
  invoiceGenRes: any = {};
  isPDFloaded = false;

  blob: any = '';
  disableIcon = false;
  constructor(
    private quoteService: QuoteService,
    private shareEvents: ShareEvents
  ) { }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'My Quotes', // enter if exists
    'pageType': 'My Quotes - Details Page',
    'isLoggedIn': 'Yes'
    });
    this.isPDFloaded = false;
    if (this.data.status == 'VALID') this.isStatusValid = true;
    else this.isStatusValid = false;

    if(this.data?.code) {
      this.getSingleQuote();
    }
    window.scroll(0, 0);
  }

  navigateToQuote() {
    this.navigateQuote.emit();

    // setting boolean state in centralized method - either quotes details page boolean is true/false
    this.shareEvents.setIsQuoteDetails(false);
  }

  // getting quote details from service
  getSingleQuote() {
    this.quoteService.getQuoteDetails(this.data.code).subscribe(data => {
      this.quote = data;
      this.isLoading$.next(false);

      // get Quote PDF from backend
      this.onInvoiceGen();
    })
  }

  // Quote PDF Generation
  onInvoiceGen() {
    let docDate: any = new Date(this.quote.expirationDate).toISOString().slice(0, 10);
    let docNumber = this.quote.code;
    let docType = 'QUOTE'; 

    this.quoteService.downloadPDF(docType, docDate, docNumber).subscribe(res => {
      this.isPDFloaded = true;
      this.blob = new Blob([res], {type: 'application/pdf'});
      this.disableIcon = this.blob.size == 0 ? true : false;
      var downloadURL = window.URL.createObjectURL(res);
      this.invoiceGenRes = downloadURL;
      this.isInvoiceGen = true;
    }, error => {
      this.isPDFloaded = true;
      this.isInvoiceGen = false;
    })
  }

  onOpenStatement() {
    window.open(this.invoiceGenRes, '_blank')
  }

}
