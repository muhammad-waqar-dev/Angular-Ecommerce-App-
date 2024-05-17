import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ViewConfig, ViewModes } from '@spartacus/storefront';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-quote-mobile',
  templateUrl: './quote-mobile.component.html',
  styleUrls: ['./quote-mobile.component.scss']
})
export class QuoteMobileComponent implements OnInit {


  @Input('scrollConfig') scrollConfig
  @Input() isGridView;
  @Input() showFilterSection;
  @Input() listViewHeading;
  
  set setConfig(inputConfig: ViewConfig) {
    this.setComponentConfigurations(inputConfig);
  }


  @Input('model') model: any;

  @Input() sortOrder;
  @Input('quotes') quotes: any;
  x: any;// = orders;
  set setModel(inputModel: any) { }


  viewMode: ViewModes;
  productLimit: number;
  maxProducts: number;
  appendProducts = false;
  resetList = false;
  isMaxProducts = false;
  isLastPage = false;
  isEmpty = false;

  showDetailsPage: boolean = false;
  quoteDetails: any = {};
  @Input() navigateQuote;
  
  constructor(private ref: ChangeDetectorRef, private quoteService: QuoteService, private shareEvents: ShareEvents) { }

  ngOnInit() {
    this.x = this.quotes;
  }


  private setComponentConfigurations(scrollConfig: ViewConfig): void {
    const isButton = scrollConfig.view?.infiniteScroll?.showMoreButton;
    const configProductLimit = scrollConfig.view?.infiniteScroll?.productLimit;

    //Display "show more" button every time when button configuration is true
    //Otherwise, only display "show more" when the configuration product limit is reached
    this.productLimit = isButton ? 1 : configProductLimit;
  }

  scrollPage(pageNumber: number): void {
    this.appendProducts = true;
    this.ref.markForCheck();
    if (this.model.currentPage !== this.model.totalPages - 1) {
      this.quoteService.getQuoteData(this.model.currentPage + 1, this.model.pageSize, this.sortOrder.code, this.quoteService.freeTextSearchQuery, this.quoteService.filters).subscribe(data=> {
        this.quotes = this.quotes.concat(data.quotes);
        this.model.currentPage = this.model.currentPage + 1;
      })
    }
  }

  // chaning showDetailsPage value as true to render detailsPageComponent
  onCardClick(data) {
    this.quoteDetails = data;
    this.showDetailsPage = !this.showDetailsPage;

    // setting boolean state in centralized method - either quotes details page boolean is true/false
    this.shareEvents.setIsQuoteDetails(this.showDetailsPage);
  }

  navigateBackQuote() {
    this.showDetailsPage = !this.showDetailsPage;
  }

}
