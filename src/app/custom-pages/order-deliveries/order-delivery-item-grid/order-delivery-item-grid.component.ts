import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { orderDeliveriesConstants, genericConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-order-delivery-item-grid',
  templateUrl: './order-delivery-item-grid.component.html',
  styleUrls: ['./order-delivery-item-grid.component.scss']
})
export class OrderDeliveryItemGridComponent implements OnInit {

  isMobile: boolean = CommonUtils.isMobile();
  @Input() order: any;
  orderDeliveriesConstants = orderDeliveriesConstants;
  genericConstants = genericConstants;
  constructor() { }

  ngOnInit() {
  }

}
