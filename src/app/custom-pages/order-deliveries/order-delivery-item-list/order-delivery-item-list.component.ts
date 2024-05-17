import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { orderDeliveriesConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-order-delivery-item-list',
  templateUrl: './order-delivery-item-list.component.html',
  styleUrls: ['./order-delivery-item-list.component.scss']
})
export class OrderDeliveryItemListComponent implements OnInit {
  orderDeliveriesConstants = orderDeliveriesConstants;
  constructor() { }
  
  isMobile: boolean = CommonUtils.isMobile();
  
  @Input() order;
  @Input() showFilterSection;

  ngOnInit(): void {
  }

  navigateToDetailsPage(order): void {

  }

}
