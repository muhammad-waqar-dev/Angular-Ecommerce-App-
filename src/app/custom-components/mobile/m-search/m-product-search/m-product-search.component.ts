import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CmsSearchBoxComponent, RoutingService, WindowRef } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService } from '@spartacus/storefront';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-m-product-search',
  templateUrl: './m-product-search.component.html',
  styleUrls: ['./m-product-search.component.scss']
})

export class MobileProductSearchComponent extends SearchBoxComponent implements OnInit {
  config = {
    displaySuggestions: true,
    displayProducts: true,
    displayProductImages: true,
    maxProducts: 120,
    maxSuggestions: 10,
    minCharactersBeforeRequest: 2
  };
  searchValue: any;
  @Output() searchvalueChange = new EventEmitter();
  @Input() searchVal;
  searchALL: string = 'product';
  constructor(public searchBoxComponentService: SearchBoxComponentService, 
    public componentData: CmsComponentData<CmsSearchBoxComponent>, 
    public winRef: WindowRef, private shareEvents: ShareEvents,
    protected routingService: RoutingService,
    private router: Router) {
    super(searchBoxComponentService, componentData, winRef, routingService);
  }
  ngOnInit() {
    if(!(window.location.pathname.includes("search"))) {
      this.searchVal = '';
    }
    this.searchActive();
  }

  searchActive() {
    if(window.location.pathname.includes("my-team")) {
      this.searchALL = 'memberTeam';
    }
    if(window.location.pathname.includes("my-orders-deliveries")) {
      this.searchALL = 'orderDelivery';
    }
    if(window.location.pathname.includes("my-quotes")) {
      this.searchALL = 'quote';
    }
    if(window.location.pathname.includes("accounts")) {
      this.searchALL = 'invoice';
    }
    
  }

  // My team search
  onSearchQuery(e) {
    if(!(window.location.pathname.includes("my-team"))) {
      this.router.navigate(['/my-team'])
      setTimeout(() => { // Timeout is require because in mobile there is global search
        this.shareEvents.mobileTeamMemberSearchSendEvent(e);
      }, 1000);
    }
    this.shareEvents.mobileTeamMemberSearchSendEvent(e);
    this.sendEvent();
  }

  onClearSearch() {
    this.shareEvents.mobileTeamMemberResetSendEvent();
    this.sendEvent();
  }

  // OrderSearch Query
  onOrderSearchQuery(e) {
    if(!(window.location.pathname.includes("my-orders-deliveries"))) {
      this.router.navigate(['/my-orders-deliveries'])
      setTimeout(() => { // Timeout is require because in mobile there is global search
        this.shareEvents.mobileOrderDeliverySearchSendEvent(e);
      }, 1000);
    }
    else {
      this.shareEvents.mobileOrderDeliverySearchSendEvent(e);
    }
    this.sendEvent();
  }

  onOrderClearSearch() {
    this.shareEvents.mobileOrderDeliveryResetSendEvent();
    this.sendEvent();
  }

  // QuoteSearch Query
  onQuoteSearchQuery(e) {
    if(!(window.location.pathname.includes("my-quotes"))) {
      this.router.navigate(['/my-quotes'])
      setTimeout(() => { // Timeout is require because in mobile there is global search
        this.shareEvents.mobileQuoteSearchSendEvent(e);
      }, 1000);
    }
    else {
        this.shareEvents.mobileQuoteSearchSendEvent(e);
    }
    this.sendEvent();
  }

  onQuoteClearSearch() {
    this.shareEvents.mobileQuoteResetSendEvent();
    this.sendEvent();
  }

  // AccountSearch Query
  onAccountSearchQuery(e) {
    if(!(window.location.pathname.includes("my-accounts"))) {
      this.router.navigate(['/my-accounts'])
      setTimeout(() => { // Timeout is require because in mobile there is global search
        this.shareEvents.mobileAccountSearchSendEvent(e);
      }, 1000);
    }
    else {
      this.shareEvents.mobileAccountSearchSendEvent(e);
    }
    this.sendEvent();
  }

  onAccountClearSearch() {
    this.shareEvents.mobileAccountResetSendEvent();
    this.sendEvent();
  }

  // Product
  routeProduct() {
    if (window.location.pathname.includes('search')) {
      this.router.navigate(['/my-products/all'])
    }
  }

  searchClick(val) {
    this.searchvalueChange.emit(val)
  }

  sendEvent() {
    this.shareEvents.mobileProductSearchSidePanelSubjectSentEvent();
  }

}
