import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { orderDeliveriesConstants, genericConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-statements-item-grid',
  templateUrl: './statements-item-grid.component.html',
  styleUrls: ['./statements-item-grid.component.scss']
})
export class StatementsGridComponent implements OnInit {

  isMobile: boolean = CommonUtils.isMobile();
  @Input() statement;
  orderDeliveriesConstants = orderDeliveriesConstants;
  genericConstants = genericConstants;
  constructor() { }

  ngOnInit() {
    this.statement['selected'] = true;
  }
  onQuoteSelect(e) {
    e.stopPropagation();
    this.statement.selected = !this.statement.selected;
  }

}
