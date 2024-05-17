import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { orderDeliveriesConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-statements-item-list',
  templateUrl: './statements-item-list.component.html',
  styleUrls: ['./statements-item-list.component.scss']
})
export class StatementsItemListComponent implements OnInit {

  constructor() { }
  
  isMobile: boolean = CommonUtils.isMobile();
  
  @Input() statement;
  @Input() showFilterSection;

  ngOnInit() {
  }
  onQuoteSelect(e) {
    e.stopPropagation();
    this.statement.selected = !this.statement.selected;
  }

  navigateToDetailsPage(statement): void {

  }

}
