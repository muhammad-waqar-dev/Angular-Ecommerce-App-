import { Component, Input, OnInit } from '@angular/core';
import { quoteConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-dashboard-quote-item-grid',
  templateUrl: './dashboard-quote-item-grid.component.html',
  styleUrls: ['./dashboard-quote-item-grid.component.scss']
})
export class DashboardQuoteItemsGridComponent implements OnInit {
  quoteConstants = quoteConstants;
  isMobile: boolean = CommonUtils.isMobile();
  @Input() quote;

  constructor() { }

  ngOnInit(): void {
  }

}
