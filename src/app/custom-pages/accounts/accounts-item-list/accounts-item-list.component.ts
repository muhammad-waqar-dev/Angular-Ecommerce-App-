import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { orderDeliveriesConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-accounts-item-list',
  templateUrl: './accounts-item-list.component.html',
  styleUrls: ['./accounts-item-list.component.scss'],
})
export class AccountsItemListComponent implements OnInit {
  constructor() {}

  isMobile: boolean = CommonUtils.isMobile();

  @Input() account: any;
  @Input() showFilterSection: any;
  @Input() isHistoricData: boolean;

  ngOnInit() {
    this.account['selected'] = false;
  }

  onAccountSelect(e: any) {
    e.stopPropagation();
    this.account.selected = !this.account.selected;
  }

  navigateToDetailsPage(account: any): void {}

  isStringContains(str: any, term: any) {
    return str?.includes(term);
  }
}
