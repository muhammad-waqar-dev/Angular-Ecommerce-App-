import { Component, Input, OnInit } from '@angular/core';
import { quoteConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-quote-items-list',
  templateUrl: './quote-items-list.component.html',
  styleUrls: ['./quote-items-list.component.scss']
})
export class QuoteItemsListComponent implements OnInit {
  quoteConstants = quoteConstants;
  isMobile: boolean = CommonUtils.isMobile();
  
  @Input() quote;
  @Input() showFilterSection;

  constructor() { }

  ngOnInit(): void {
   // this.checkStatusUpdate();
  }

  checkStatusUpdate() {
    let dateNow = new Date().getTime();
    let offsetDays = 86400000*14;
    let expDate = new Date(this.quote.expirationDate).getTime();    

    if(this.quote.state !== 'EXPIRED' && expDate < dateNow+offsetDays && expDate > dateNow) {
      this.quote.formattedState = 'Due to Expire'
    }
    else if(this.quote.state !== 'EXPIRED' &&  expDate <= dateNow) {
      this.quote.formattedState = 'EXPIRED'
    }
    
    else{
      this.quote.formattedState = this.quote.state;
    }
  }

  navigateToDetailsPage(quote): void {
  }

}
