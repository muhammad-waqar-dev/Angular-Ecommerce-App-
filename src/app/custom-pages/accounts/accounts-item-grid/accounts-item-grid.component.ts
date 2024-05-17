import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import {
  orderDeliveriesConstants,
  genericConstants,
} from 'src/app/core/constants/general';

@Component({
  selector: 'app-accounts-item-grid',
  templateUrl: './accounts-item-grid.component.html',
  styleUrls: ['./accounts-item-grid.component.scss'],
})
export class AccountsGridComponent implements OnInit {
  isMobile: boolean = CommonUtils.isMobile();
  @Input() account: any;
  @Input() isHistoricData: boolean;
  orderDeliveriesConstants = orderDeliveriesConstants;
  genericConstants = genericConstants;
  constructor() { }

  ngOnInit() {
    this.account['selected'] = true;
    // for credit note change the text shown on card
    if (this.account?.docDescription === 'Credit Return') {
      this.account.docDescription = 'Credit Note';
    }

    // for rebate change the text shown on card
    if (this.account?.docDescription?.includes('Canc')) {
      this.account.docDescription = 'Rebate';
    }
  }

  onAccountSelect(e: any): void {
    e.stopPropagation();
    this.account.selected = !this.account?.selected;
  }

  ifDocDescriptionContains(objContains: any, strMatch: string): boolean {
    let description = strMatch?.toLowerCase();
    let objCont = objContains?.toLowerCase();
    return objCont?.includes(description);
  }

  generateName(status: any): string {

    // Old Code leaving as it is for future use
    // if (this.ifDocDescriptionContains(status, 'Credit')) return 'Credit Note';
    // if (this.ifDocDescriptionContains(status, 'Invoice')) return 'Invoice';
    // if (this.ifDocDescriptionContains(status, 'Debit')) return 'Debit Note';
    // if (this.ifDocDescriptionContains(status, 'Rebate')) return 'Rebate';
    // switch(status) {
    //   case 'RV':
    //   case 'DR':
    //     return 'Invoice';
    //   case 'ZN':
    //   case 'DG':
    //     return 'Credit Note';
    //   case 'ZD':
    //     return 'Debit Note';
    //   case 'ZW':
    //     return 'Rebate';
    // }


    switch (status?.toLowerCase()) {
      case 'rv':
      case 'dr':
      case 'inv':
      case 'ur':
        return 'Invoice';
      case 'cre':
      case 'zn':
      case 'dg':
        return 'Credit Note';
      case 'deb':
      case 'zd':
        return 'Debit Note';
      case 'reb':
      case 'zw':
        return 'Rebate';
      default:
        return 'Invoice';
    }
  }



  isStringContains(str: string, term: string): boolean {
    return str?.includes(term);
  }

  getImageSrc(status: any) {
    switch (status?.toLowerCase()) {
      case 'overdue':
      case 'over due':
        return `../../../../assets/images/status-icons/active/invoice-overdue.svg`;
      case 'dispute':
        return `../../../../assets/images/status-icons/active/invoice-disputed.svg`;
      case 'outstanding':
        return `../../../../assets/images/status-icons/active/invoice-outstanding.svg`;
      case 'paid':
        return `../../../../assets/images/status-icons/active/invoice-paid.svg`;
      default:
        return `../../../../assets/images/status-icons/active/invoice-inprogress.svg`;
    }
  }

  isNullOrEmpty(value: any) {
    return value == '' || value == null || typeof value == 'undefined' || value == 'undefined';
  }


  getCurrentStatus(inp?: any) {
    if (this.account?.InProgress) {
      return (inp?.toLowerCase() === 'img') ? this.getImageSrc('in-progress') : 'In-Progress';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '2' && this.isNullOrEmpty(this.account?.SpecialGeneralLedgerCode) && this.account?.IsDueNet == 'X') {
      return (inp?.toLowerCase() === 'img') ? this.getImageSrc('overdue') : 'Overdue';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '2' && this.isNullOrEmpty(this.account?.SpecialGeneralLedgerCode)  && !this.isNullOrEmpty(this.account?.DisputeCaseUUID) && !this.isNullOrEmpty(this.account?.DisputeCaseStatus)) {
      return (inp?.toLowerCase() === 'img') ? this.getImageSrc('dispute') : 'Disputed';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '2' && (this.isNullOrEmpty(this.account?.IsDueNet) || this.account?.IsDueNet == 'X')) {
      return (inp?.toLowerCase() === 'img') ? this.getImageSrc('outstanding') : 'Outstanding';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '1' && this.isNullOrEmpty(this.account?.SpecialGeneralLedgerCode) && !this.isNullOrEmpty(this.account?.ClearingAccountingDocument) && this.isNullOrEmpty(this.account?.IsClearingReversed)) {
      return (inp?.toLowerCase() === 'img') ? this.getImageSrc('paid') : 'Paid';
    } else {
      return (inp?.toLowerCase() === 'img') ? this.getImageSrc('in-progress') : 'In-Progress';
    }
  }

}
