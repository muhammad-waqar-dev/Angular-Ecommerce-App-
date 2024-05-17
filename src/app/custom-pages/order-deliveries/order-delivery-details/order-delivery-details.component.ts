import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ContentPageMetaResolver } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { orderDetailsConstants, homeConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { orderDeliveriesConstants, genericConstants, dashboardPageConstants } from 'src/app/core/constants/general';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-delivery-details',
  templateUrl: './order-delivery-details.component.html',
  styleUrls: ['./order-delivery-details.component.scss']
})
export class OrderDeliveryDetailsComponent implements OnInit, OnDestroy {

  @Input('data') data: any;
  @Input('isFromDashboard') isFromDashboard: boolean = false;
  
  isStatusReceived: boolean = false;
  order: any = {};
  subscription = new Subscription();
  isLoading$ = new BehaviorSubject<boolean>(true);
  homeConstants = homeConstants;
  orderDetailsConstants = orderDetailsConstants;
  @Output() navigateOrder: EventEmitter<any> = new EventEmitter();
  isMobile = CommonUtils.isMobile();

  orderDeliveriesConstants = orderDeliveriesConstants;
  genericConstants = genericConstants;
  dashboardPageConstants = dashboardPageConstants;

  isInvoiceGen: boolean = false;
  invoiceGenRes: any = {};
  isPDFloaded = false;

  blob: any = '';

  requestedDeliveryDate = '';
  disableIcon = false;
  constructor(
    private orderService: OrderDeliveryService,
    private shareEvents: ShareEvents,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'My Orders and Deliveries', // enter if exists
    'pageType': 'My Orders and Deliveries - Details Page',
    'isLoggedIn': 'Yes'
    });
    this.isPDFloaded = false;
    if (this.data.status == 'RECEIVED' || this.data.status == 'PENDING') { 
      this.isStatusReceived = true;
    }
    else {
      this.isStatusReceived = false;
    }

    if(this.data.guid) {
      this.getSingleOrder();
    }
    window.scroll(0, 0);
  }

  // getting order details from service
  getSingleOrder() {
    this.orderService.getOrderDetails(this.data.guid).subscribe(data => {
      this.order = data;
      
      if(data?.requestedDeliveryDate !== undefined) {
        let reqDevDate = data?.requestedDeliveryDate.split('T')
        this.requestedDeliveryDate = reqDevDate[0];
      }

      
      let deliveryDateVal = new Date(this.order.requestedDeliveryDate);

        if(this.order.requestedDeliveryDate !== null && this.order.requestedDeliveryDate !== undefined) {
         this.order.requestedDeliveryDate = this.datepipe.transform(deliveryDateVal, 'dd MMM yy');
        }
      this.isLoading$.next(false);
      this.onInvoiceGen();
    })
  }

  navigateToOrder() {
    this.navigateOrder.emit();

    // setting boolean state in centralized method - either order details page boolean is true/false
    this.shareEvents.setIsOrderDetails(false);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Quote PDF Generation
  onInvoiceGen() {
    let docDate: any = new Date(this.order.created).toISOString().slice(0, 10);
    let docNumber = this.order.code;
    let docType = 'ORDER'; 

    this.orderService.downloadPDF(docType, docDate, docNumber).subscribe(res => {
      this.blob = new Blob([res], {type: 'application/pdf'});
      this.isPDFloaded = true;
      this.disableIcon = this.blob.size == 0 ? true : false;
      var downloadURL = window.URL.createObjectURL(res);
      this.invoiceGenRes = downloadURL;
      this.isInvoiceGen = true;
    }, error => {
      this.isPDFloaded = true;
    })
  }

  onOpenStatement() {
    window.open(this.invoiceGenRes, '_blank')
  }

}
