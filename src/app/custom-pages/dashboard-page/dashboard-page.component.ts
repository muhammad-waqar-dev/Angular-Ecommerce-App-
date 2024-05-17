import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { dashboardPageConstants, genericConstants } from 'src/app/core/constants/general';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  isLoading$ = new BehaviorSubject<boolean>(true);

  dashboardPageConstants: any = dashboardPageConstants;
  genericConstants: any = genericConstants;

  showDetailsPage: boolean = false;
  quoteDetails: any = {};
  isQuoteDetails: boolean = false;

  showOrderDetailsPage: boolean = false;
  orderDetails: any = {};
  isOrderDetails: boolean = false;

  constructor(
    private dashboard: DashboardService,
    private shareEvents: ShareEvents,
    private router: Router,
    private datepipe: DatePipe
  ) { 
    this.shareEvents.resetGlobalSearchSendEvent();
  }

  quotes = []
  ordersCreatedDate = []
  ordersDeliveryDate = []

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
(<any>window).dataLayer.push({
'event': 'Page-Details', //constant value
'currentURL': window.location.href, // page url
'currentPageTitle': 'My Dashboard', // enter if exists
'pageType': 'My Dashboard',
'isLoggedIn': 'Yes'
});
    this.getQuotes();
    this.getOrders();
  }

  paymentGraphLoad(e) {
    this.isLoading$.next(false);
  }

  // chaning showDetailsPage value as true to render detailsPageComponent
  onCardClickQuote(data) {
    this.quoteDetails = data;
    this.showDetailsPage = !this.showDetailsPage;

    // setting boolean state in centralized method - either quotes details page boolean is true/false
    this.shareEvents.setIsQuoteDetails(this.showDetailsPage);
  }

  // chaning showOrderDetailsPage value as true to render detailsPageComponent
  onCardClickOrder(data) {
    this.orderDetails = data;
    this.showOrderDetailsPage = !this.showOrderDetailsPage;

    // setting boolean state in centralized method - either quotes details page boolean is true/false
    this.shareEvents.setIsOrderDetails(this.showOrderDetailsPage);
  }

  navigateBackQuote() {
    this.showDetailsPage = !this.showDetailsPage;
  }

  navigateBackOrders() {
    this.showOrderDetailsPage = !this.showOrderDetailsPage;
  }

  getQuotes(): void {
    this.dashboard.getQuoteData(0, 3, 'quoteExpirationDate:DESC', 'quotes:DUETOEXPIRE').subscribe(res => {
      this.quotes = res.quotes;
    })
  }

  getOrders(): void {
    let pageSize = 6;
    let startDate = new Date();
    startDate.setDate(startDate.getDate()-7);
    let startDate1 = startDate.toISOString().split('.')
    let st = startDate1[0].split('T');
    let stFormatted = st[0].split('-')
    let formattedStartDateString = stFormatted[2]+ '-' + stFormatted[1] + '-' + stFormatted[0] + 'T' + st[1];

    let endDate = new Date();
    let endDate1 = endDate.toISOString().split('.')
    let st1 = endDate1[0].split('T');
    let stFormatted1 = st1[0].split('-')
    let formattedEndDateString = stFormatted1[2]+ '-' + stFormatted1[1] + '-' + stFormatted1[0] + 'T' + st[1];

    this.dashboard.getOrderCreatedData(formattedEndDateString, formattedStartDateString, pageSize).subscribe(res1 => {
      let createdSortedData = res1?.orders?.sort(function(date1,date2){
        return date2?.requestedDeliveryDate - date1?.requestedDeliveryDate;
      });

      createdSortedData?.forEach((element, i) => {
        if(i < 3) {
          this.ordersCreatedDate.push(element);
        }
      });
      this.dashboard.getOrderDeliverydData(formattedEndDateString, formattedStartDateString, pageSize).subscribe(res2 => {
        let deliveredSortedData = res2?.orders?.sort(function(dateD1,dateD2){
          return dateD2?.requestedDeliveryDate - dateD1?.requestedDeliveryDate;
        });
  
        deliveredSortedData?.forEach((element, i) => {
          if(i < 3) {
            this.ordersDeliveryDate.push(element);
          }
        });

        for(let i = 0; i < this.ordersDeliveryDate.length; i++) {
          if(this.ordersDeliveryDate[i].deliveryDate !== null && this.ordersDeliveryDate[i].deliveryDate !== undefined) {
          let deliveryDateVal = new Date(this.ordersDeliveryDate[i].deliveryDate);
           this.ordersDeliveryDate[i].deliveryDate = this.datepipe.transform(deliveryDateVal, 'dd MMM yy');
          }
         }

        for(let i = 0; i < this.ordersCreatedDate.length; i++) {
          if(this.ordersCreatedDate[i].deliveryDate !==null && this.ordersCreatedDate[i].deliveryDate !== undefined) {
            let deliveryDateVal = new Date(this.ordersCreatedDate[i].deliveryDate);
            this.ordersCreatedDate[i].deliveryDate = this.datepipe.transform(deliveryDateVal, 'dd MMM yy');
          }
        }

      })
    })
    
  }

  navigateToAllOrders(){
    this.router.navigate(['/my-orders-deliveries'])
  }

  navigateToAllQuotes(){
    this.router.navigate(['/my-quotes'])
  }

}
