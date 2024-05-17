import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { orderDeliveriesConstants, genericConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-dashboard-order-delivery-item-grid',
  templateUrl: './dashboard-order-delivery-item-grid.component.html',
  styleUrls: ['./dashboard-order-delivery-item-grid.component.scss']
})
export class DashboardOrderDeliveryItemGridComponent implements OnInit {

  isMobile: boolean = CommonUtils.isMobile();
  @Input() order;
  orderDeliveriesConstants = orderDeliveriesConstants;
  genericConstants = genericConstants;
  constructor() { }

  ngOnInit() {
  }

}
