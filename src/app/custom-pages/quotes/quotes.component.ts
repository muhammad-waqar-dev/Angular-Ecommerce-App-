import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewConfig } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'src/app/core/utils/utils';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { quoteConstants, genericConstants } from 'src/app/core/constants/general';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  quoteConstants = quoteConstants;
  genericConstants = genericConstants;
  divContent = true;
  showFilterSection: boolean = true;
  isGridView: boolean = true;
  permissionAllowed: boolean = true;
  isSortingInit: boolean = false;
  ErrorMsgText: string;
  isMobile = CommonUtils.isMobile();
  isInfiniteScroll: boolean = this.isMobile;
  modalRef: any;
  isLoading$ = new BehaviorSubject<boolean>(true);
  filtersModel: any = [];
  filtersState = [[]]
  quotes = []
  @Input() navigateQuote;
  pageSize: number = 12;
  paginationModel = {
    currentPage: 0,
    pageSize: this.pageSize,
    sort: '',
    totalPages: 3,
    totalResults: 10,
  };
  sortOption = []
  selectedSortName: any = {
    code: "state",
    name: "Quote status",
    selected: true
  }
  listViewHeading = [
    {
      name: 'FI Quote No.',
      id: 'QO'
    },
    {
      name: 'Status',
      id: 'Status'
    },
    {
      name: 'Project Name',
      id: 'project'
    },
    {
      name: 'Delivery Address',
      id: 'address'
    }
  ]
  public isPaginationModel$ = new BehaviorSubject<boolean>(true);
  showDetailsPage: boolean = false;
  quoteDetails: any = {};
  isQuoteDetails: boolean = false;

  constructor(
    private modalService: NgbModal,
    private shareEvents: ShareEvents, private scrollConfig: ViewConfig,
    private permissionUtil: PermissionService,
    private quoteService: QuoteService,
    private datepipe: DatePipe
  ) {
    this.shareEvents.resetGlobalSearchSendEvent();
   }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'My Quotes', // enter if exists
    'pageType': 'My Quotes',
    'isLoggedIn': 'Yes'
    });
    this.shareEvents.mobileQuoteReceiveEvent().subscribe((data) => {
      this.onQuoteSearchQuery(data);
    });

    this.shareEvents.mobileQuoteResetReceiveEvent().subscribe(() => {
      this.onQuoteClearSearch();
    })

    if (this.isMobile) {
      this.listViewHeading.pop(); //since we dont have address for mobile, so remove it
    }
    this.quoteService.filters = 'ALLQUOTES'
    this.getQuotes();
    
    // subscribing the centralized observable - either quotes details page boolean is true/false
    this.shareEvents.isQuoteDetails.subscribe(res => {
      this.isQuoteDetails = res;
    })

   this.isQuoteDetails = false;
  }

  getQuotes() {
    this.isLoading$.next(true);
    this.quoteService.getQuoteData(this.paginationModel.currentPage, this.pageSize, this.selectedSortName.code, this.quoteService.freeTextSearchQuery, this.quoteService.filters).subscribe(data=> {
      this.quotes = data.quotes;
      this.filtersModel = data.filters;
      this.sortOption = data.sorts
      this.initializeSortOrder(this.selectedSortName.code)
      this.paginationModel = data.pagination;
      this.isPaginationModel$.next(false);
      this.isLoading$.next(false);
      this.initializeFilterState();
      for(let i = 0; i < this.quotes.length; i++) {
        if(this.quotes[i].expirationDate !== null && this.quotes[i].expirationDate !== undefined) {
          let deliveryDateVal = new Date(this.quotes[i].expirationDate);
          this.quotes[i].expirationDate = this.datepipe.transform(deliveryDateVal, 'dd MMM yy');
        }
       }
    }, error => {
      if(error.status == 403) {
        this.permissionAllowed = false;
      }
      else {
          this.ErrorMsgText = error.error.errors[0].message;
      }
      this.isLoading$.next(false);
    })
  }

  toggleDivContent() {
    this.divContent = !this.divContent;
    this.showFilterSection = !this.showFilterSection;
  }
  openFiltersPopup(content) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
  }
  
  initializeSortOrder(e) {

    if(!this.isSortingInit){
      this.quoteService.sortOrderState = []
      this.sortOption.forEach(j=>{
        this.quoteService.sortOrderState[j.code] = 'ASC'
      })
    
      this.isSortingInit = true;
    }
    
  }

  initializeFilterState() {
    this.filtersModel.forEach((n, m) => {
      this.filtersState[m] = [];
      n.values.forEach((e, o) => {
        this.filtersState[m][o] = e.selected;
      });
    })
  }

  quotesPerPageSelectionChange(value) {
    this.pageSize = value;
    this.getQuotes();
    window.scroll(0, 0);
  }

  pageChange(event) {
    this.paginationModel.currentPage = event;
    this.getQuotes();
    window.scroll(0, 0);
  }

  toggleGridView(e) {
    this.isGridView = (e) ? true : false;
  }

  changeSortOption(e) {
    this.selectedSortName = this.sortOption[e]
    this.sortOption.forEach(k => {
      k.selected = false;
    })
    this.sortOption[e].selected = true;
    this.paginationModel.currentPage = 0;
    this.getQuotes();
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

  onQuoteSearchQuery(e) {
    if(!e.isDate){
      this.quoteService.freeTextSearchQuery = e.searchValue;
      this.quoteService.createdBefore = '';
      this.quoteService.createdAfter = '';
    }
    else{
      if(e.searchValue.minDate == undefined) {
        e.searchValue.minDate = this.shareEvents.quoteSearchFromDate;
      }
      if(e.searchValue.maxDate == undefined) {
        e.searchValue.maxDate = this.shareEvents.quoteSearchToDate;
      }

      if(e.searchValue.minDate.day < 10){
        e.searchValue.minDate.day = '0'+e.searchValue.minDate.day
      }
      if(e.searchValue.minDate.month < 10){
        e.searchValue.minDate.month = '0'+e.searchValue.minDate.month
      } 

      if(e.searchValue.maxDate.day < 10){
        e.searchValue.maxDate.day = '0'+e.searchValue.maxDate.day
      }
      if(e.searchValue.maxDate.month < 10){
        e.searchValue.maxDate.month = '0'+e.searchValue.maxDate.month
      } 
      let dateAfter = new Date(e.searchValue.minDate.year+"-" + e.searchValue.minDate.month+"-"+  e.searchValue.minDate.day+ "T"+ '00:00:00');
      let dateBefore = new Date(e.searchValue.maxDate.year+"-" + e.searchValue.maxDate.month+"-"+  e.searchValue.maxDate.day + "T"+ '23:59:59');      
     
      this.quoteService.createdAfter = this.convertToUTCFormat(dateAfter);
      this.quoteService.createdBefore = this.convertToUTCFormat(dateBefore);
      this.quoteService.freeTextSearchQuery = '';
    }
    this.paginationModel.currentPage = 0;
    this.getQuotes();
  }

  convertToUTCFormat(date){
    let b = date.toISOString()
    let a = b.split('.')
    let c = a[0].split('-')

    let d = c[2].split('T')
    return d[0] + '-' + c[1] + '-' + c[0] + 'T' + d[1]
    
  }

  onFilterSelection($event) {
    this.paginationModel.currentPage = 0;
    if($event.value.code === 'ALLQUOTES'){
      this.quoteService.filters = ''
      this.quoteService.filters = 'ALLQUOTES'
    }
    else{
      if(this.quoteService.filters === 'ALLQUOTES'){ 
        this.quoteService.filters = ''
      }
    

    if (this.quoteService.filters) {
      if (this.quoteService.filters.includes($event.value.code)) {
        this.quoteService.filters = this.quoteService.filters.replace($event.value.code, '')

        this.quoteService.filters = this.quoteService.filters.replace(/(^,)|(,$)/g, "")
      }
      else {
        this.quoteService.filters = this.quoteService.filters + ',' + $event.value.code
      }
    }
    else {
      this.quoteService.filters = $event.value.code
    }
    if (this.quoteService.filters.includes(',,')) {
      this.quoteService.filters = this.quoteService.filters.replace(',,', ',')
    }
  }
    this.paginationModel.currentPage = 0;
    this.getQuotes();
  }
  onQuoteClearSearch(){
    this.quoteService.createdBefore = '';
    this.quoteService.createdAfter = '';
    this.quoteService.freeTextSearchQuery = '';
    this.paginationModel.currentPage = 0;
    this.getQuotes();
  }

  changeSortOrder(e, code, i) {
    this.selectedSortName = this.sortOption[i]
    this.sortOption.forEach(k => {
      k.selected = false;
    })
    this.sortOption[i].selected = true;


    let order: string;
    if(e === 'ASC'){
      order = 'DESC'
    }
    else {
      order = 'ASC'
    }
    this.quoteService.sortOrderState[code] = order;
    this.paginationModel.currentPage = 0;
    this.getQuotes();
  }

  resetFilters() {
    this.quoteService.createdBefore = '';
    this.quoteService.createdAfter = '';
    this.quoteService.freeTextSearchQuery = '';
    this.paginationModel.currentPage = 0;
    this.quoteService.filters = 'ALLQUOTES'
    this.selectedSortName = {
      code: "state",
      name: "Quote status",
      selected: true
    }
    this.getQuotes();
  }

}