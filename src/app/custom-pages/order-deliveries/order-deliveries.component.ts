import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewConfig } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'src/app/core/utils/utils';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';
import { orderDeliveriesConstants, genericConstants, permissionAccessMessage } from 'src/app/core/constants/general';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-deliveries',
  templateUrl: './order-deliveries.component.html',
  styleUrls: ['./order-deliveries.component.scss']
})
export class OrderDeliveriesComponent implements OnInit {
    
  orderDeliveriesConstants = orderDeliveriesConstants;
  genericConstants = genericConstants
  divContent = true;
  showFilterSection: boolean = true;
  isGridView: boolean = true;
  ErrorMsgText: string;
  isMobile = CommonUtils.isMobile();
  isInfiniteScroll: boolean = this.isMobile;
  modalRef: any;
  isLoading$ = new BehaviorSubject<boolean>(true);
  permissionAllowed: boolean = true;
  isSortingInit: boolean = false;
  filtersModel: any = [];
  filtersState = [[]]
  orders = []
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
    code: "date",
    name: "Order Created Date",
    selected: true
  }
  listViewHeading = [
    {
      name: 'Your Reference No.',
      id: 'PO'
    },
    {
      name: 'Delivery Status',
      id: 'Status'
    },
    {
      name: 'Requested Delivery Date',
      id: 'Date'
    },
    {
      name: 'Delivery Address',
      id: 'address'
    },
    {
      name: 'FI Order No',
      id: 'orderNumHeading'
    }
  ]
  public isPaginationModel$ = new BehaviorSubject<boolean>(true);
  showDetailsPage: boolean = false;
  orderDetails: any = {};
  isOrderDetails: boolean = false;

  @Input() navigateOrder;
  constructor(
    private modalService: NgbModal,
    private shareEvents: ShareEvents, scrollConfig: ViewConfig,
    private permissionUtil: PermissionService,
    public orderService: OrderDeliveryService,
    private datepipe: DatePipe) {
      this.shareEvents.resetGlobalSearchSendEvent();
    console.log('Deploy')

     }

  ngOnInit(): void {    
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'My Orders and Deliveries', // enter if exists
    'pageType': 'My Orders and Deliveries',
    'isLoggedIn': 'Yes'
    });
    this.emptyServiceState();
    
    if(this.isMobile){
      this.listViewHeading.pop(); //since we dont have address for mobile, so remove it
      this.listViewHeading.pop();
    }

    this.shareEvents.mobileOrderDeliverySearchReceiveEvent().subscribe((data) => {
      this.onOrderSearchQuery(data);
    })

    this.shareEvents.mobileOrderDeliveryResetReceiveEvent().subscribe((data) => {
      this.onOrderClearSearch();
    })

    this.filtersModel = []

    this.orders = []

    this.getOrders();
    
    // subscribing the centralized observable - either orders details page boolean is true/false
    this.shareEvents.isOrderDetails.subscribe(res => {
      this.isOrderDetails = res;
    })
    this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbOrdersDeliveriesGroup");

    this.isOrderDetails = false;
  }

  getOrders() {
    // get orders API here..
    this.isPaginationModel$.next(false);
    this.isLoading$.next(true);
    this.orderService.getOrderData(this.paginationModel.currentPage, this.pageSize, this.selectedSortName.code, this.orderService.freeTextSearchQuery).subscribe(data=> {
      this.orders = data.orders;
      this.paginationModel = data.pagination;
      
      this.sortOption = data.sorts;
      this.permissionAllowed = true;
      this.isLoading$.next(false);
      this.initializeSortOrder(this.selectedSortName.code)
      this.setSortDefaultOption();
      
      this.filtersModel = data.filters;
      for(let i = 0; i < this.orders.length; i++) {
       if(this.orders[i].deliveryDate !== null && this.orders[i].deliveryDate !== undefined) {
        let reqDevDate = this.orders[i].deliveryDate.split('T')
        this.orders[i].deliveryDate = reqDevDate[0];
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
    // getOrderData
  }
  setSortDefaultOption() {
    let i = 0;
    this.sortOption.forEach(k=>{
      if(k.selected){
        i++;
      }
    })
    if(i === 0){
      this.sortOption.forEach(k=>{
        if(k.code === 'date'){
          k.selected = true;
        }
      })
    }
  }
  

  toggleDivContent() {
    this.divContent = !this.divContent;
    this.showFilterSection = !this.showFilterSection;
  }
  openFiltersPopup(content) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  initializeFilterState() {
    this.filtersModel.forEach((n, m) => {
      this.filtersState[m] = [];
      n.values.forEach((e, o) => {
        this.filtersState[m][o] = e.selected;
      });
    })
    
  }

  emptyServiceState () {
    this.orderService.freeTextSearchQuery = '';
    this.orderService.filters = '';
    this.orderService.deliveredOrderFilter = false;
    this.orderService.currentOrderFilter = true;

    this.orderService.sortOrder = 'DESC';
    this.orderService.createdBefore = '';
    this.orderService.createdAfter = '';
    this.orderService.sortOrderState = [];
  }

  ordersPerPageSelectionChange(value) {
    this.pageSize = value;
    this.getOrders();
    window.scroll(0, 0);
  }

  onFilterSelection($event) {
    this.paginationModel.currentPage = 0;
    if($event.value.code === 'AllOrders'){
      this.orderService.deliveredOrderFilter = false;
      this.orderService.currentOrderFilter = false;
      this.orderService.filters = 'ALL'
    }
    else{
    
    if($event.value.code === 'deliveredOrderfilter'){
      this.orderService.deliveredOrderFilter = $event.selected;
      this.orderService.currentOrderFilter = false
      this.emptyAllFilter()
    }
    else if($event.value.code === 'currentOrderfilter'){
      this.orderService.currentOrderFilter = $event.selected;
      this.orderService.deliveredOrderFilter = false;
      this.orderService.filters = ''
    }
    else{
      this.emptyAllFilter()
      this.orderService.currentOrderFilter = false

        if (this.orderService.filters) {
          if (this.orderService.filters.includes($event.value.code)) {
            this.orderService.filters = this.orderService.filters.replace($event.value.code, '')
    
            this.orderService.filters = this.orderService.filters.replace(/(^,)|(,$)/g, "")
          }
          else {
            this.orderService.filters = this.orderService.filters + ',' + $event.value.code
          }
        }
        else {
          this.orderService.filters = $event.value.code
        }
        if (this.orderService.filters.includes(',,')) {
          this.orderService.filters = this.orderService.filters.replace(',,', ',')
        }
    }
  }
    this.paginationModel.currentPage = 0;
    this.getOrders();
  }

  emptyAllFilter(){
    if(this.orderService.filters === 'ALL'){
      this.orderService.filters = ''
    }
  }

  pageChange(event) {
    this.paginationModel.currentPage = event;
    this.getOrders();
    window.scroll(0, 0);
  }

  toggleGridView(e){
    this.isGridView = (e) ? true : false;
  }

  changeSortOption(e){
    this.selectedSortName = this.sortOption[e]
    this.sortOption.forEach(k=> {
      k.selected = false;
    })
    this.sortOption[e].selected = true;

    this.paginationModel.currentPage = 0;
    this.getOrders();
  }

  onCardClick(data) {
    this.orderDetails = data;
    this.showDetailsPage = !this.showDetailsPage;

    this.shareEvents.setIsOrderDetails(this.showDetailsPage);
  }

  navigateBackOrder() {
    this.showDetailsPage = !this.showDetailsPage;
  }

  onOrderSearchQuery(e) {
    if(!e.isDate){
      this.orderService.freeTextSearchQuery = e.searchValue;
      this.orderService.createdAfter = '';
      this.orderService.createdBefore = "";
    }
    else{
      if(e.searchValue.minDate == undefined) {
        e.searchValue.minDate = this.shareEvents.orderSearchFromDate;
      }
      if(e.searchValue.maxDate == undefined) {
        e.searchValue.maxDate = this.shareEvents.orderSearchToDate;
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
     
      this.orderService.createdAfter = this.convertToUTCFormat(dateAfter);
      this.orderService.createdBefore = this.convertToUTCFormat(dateBefore);
      this.orderService.freeTextSearchQuery = "";
    }

    this.paginationModel.currentPage = 0;
    this.getOrders();
  }

  convertToUTCFormat(date){
    let b = date.toISOString()
    let a = b.split('.')
    let c = a[0].split('-')

    let d = c[2].split('T')
    return d[0] + '-' + c[1] + '-' + c[0] + 'T' + d[1]
    
  }

  onOrderClearSearch() {
    this.shareEvents.orderSearchVal = '';
    this.shareEvents.orderSearchFromDate = '';
    this.shareEvents.orderSearchToDate = '';  
 
    this.orderService.createdBefore = '';
    this.orderService.createdAfter = '';
    this.orderService.freeTextSearchQuery = '';

    this.paginationModel.currentPage = 0;
    this.getOrders();
  }

  initializeSortOrder(e) {

    if(!this.isSortingInit){
      this.orderService.sortOrderState = []
      this.sortOption.forEach(j=>{
        this.orderService.sortOrderState[j.code] = 'DESC'
      })
      
      this.isSortingInit = true;
    }
    
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
    this.orderService.sortOrderState[code] = order;
    this.paginationModel.currentPage = 0;
    this.getOrders();
  }

  resetFilters() {
    this.shareEvents.orderSearchVal = '';
    this.shareEvents.orderSearchFromDate = '';
    this.shareEvents.orderSearchToDate = '';  

    this.paginationModel.currentPage = 0;

    this.orderService.createdBefore = '';
    this.orderService.createdAfter = '';
    this.orderService.freeTextSearchQuery = '';
    this.orderService.currentOrderFilter = true;
    this.orderService.deliveredOrderFilter = false;
    this.orderService.filters = '';

    this.getOrders()
  }
 
}
