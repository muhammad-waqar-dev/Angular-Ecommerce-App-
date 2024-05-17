import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ViewConfig, ViewModes } from '@spartacus/storefront';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-order-delivery-mobile',
  templateUrl: './order-delivery-mobile.component.html',
  styleUrls: ['./order-delivery-mobile.component.scss']
})
export class OrderDeliveryMobileComponent implements OnInit {


  @Input('scrollConfig') scrollConfig
  @Input() isGridView;
  @Input() showFilterSection;
  @Input() listViewHeading;
  @Input() navigateOrder;
  set setConfig(inputConfig: ViewConfig) {
    this.setComponentConfigurations(inputConfig);
  }


  @Input('model') model: any;

  @Input() sortOrder;
  @Input('orders') orders: any;
  x: any;
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
  orderDetails: any = {};
  
  constructor(private ref: ChangeDetectorRef, private orderService: OrderDeliveryService, private shareEvents: ShareEvents) { }

  ngOnInit() {
    this.x = this.orders;
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
      this.orderService.getOrderData(this.model.currentPage + 1, this.model.pageSize, this.sortOrder.code, this.orderService.freeTextSearchQuery).subscribe(data=> {
        this.orders = this.orders.concat(data.orders);
        this.model.currentPage = this.model.currentPage + 1;
      })
    }
  }

  // chaning showDetailsPage value as true to render detailsPageComponent
  onCardClick(data) {
    this.orderDetails = data;
    this.showDetailsPage = !this.showDetailsPage;

    // setting boolean state in centralized method - either orders details page boolean is true/false
    this.shareEvents.setIsOrderDetails(this.showDetailsPage);
  }

  navigateBackOrder() {
    this.showDetailsPage = !this.showDetailsPage;
  }

}
