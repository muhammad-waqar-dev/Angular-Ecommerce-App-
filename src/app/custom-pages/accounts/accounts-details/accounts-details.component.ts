import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import {
  accountConstants,
  genericConstants,
  homeConstants,
} from 'src/app/core/constants/general';
import { AccountsService } from 'src/app/shared/services/accounts.service';

@Component({
  selector: 'app-accounts-details',
  templateUrl: './accounts-details.component.html',
  styleUrls: ['./accounts-details.component.scss'],
})
export class AccountsDetailsComponent implements OnInit {
  @Input('data') data: any;
  @Input() isHistoricData: boolean;
  @Input() isStatements: boolean = false;
  @Output() navigateAccount: EventEmitter<any> = new EventEmitter();

  account: any = {};
  isLoading$ = new BehaviorSubject<boolean>(false);
  isMobile = CommonUtils.isMobile();

  accountConstants = accountConstants;
  genericConstants = genericConstants;
  homeConstants = homeConstants;

  isInvoiceGen: boolean = false;
  invoiceGenRes: any = {};

  blob: any = '';
  disableIcon = false;
  constructor(
    private shareEvents: ShareEvents,
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    if(this.data?.NetDueDate) {
      this.data.NetDueDate = new Date(parseInt(this.data?.NetDueDate.replace(/[^0-9]/g, "")));
    }
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      event: 'Page-Details', //constant value
      currentURL: window.location.href, // page url
      currentPageTitle: 'My Accounts', // enter if exists
      pageType: 'My Accounts - Details Page',
      isLoggedIn: 'Yes',
    });

    // console.log('Current Data : ', this.data);

    this.accountsService.invoicePaymentSubTotal = this.data?.AmountInCompanyCodeCurrency;
    this.accountsService.invoicePaymentObject = this.data;
    this.accountsService.invoiceNumDetail = this.data?.AccountingDocument;
    this.account = this.data;
    window.scroll(0, 0);

    this.onInvoiceGen();
    this.setDocTypeInService();
  }

  getFormattedDueDate(netDueDate: any): any {
    return new Date (eval(netDueDate?.replace(/[^0-9]/g, "")));
  }

  navigateToOrder(): void {
    this.navigateAccount.emit();

    // setting boolean state in centralized method - either account details page boolean is true/false
    this.shareEvents.setIsAccountDetails(false);
  }

  setDocTypeInService(): void {
    // Keeping the old code commented to check if its any change required in future
    // let docType = '';
    // if (this.ifDocDescriptionContains(this.account?.docDescription, 'INVOICE'))
    //   docType = 'Invoice';
    // if (this.ifDocDescriptionContains(this.account?.docDescription, 'Credit'))
    //   docType = 'Credit';
    // if (this.ifDocDescriptionContains(this.account?.docDescription, 'Debit'))
    //   docType = 'Debit';
    // if (this.ifDocDescriptionContains(this.account?.docDescription, 'Rebate'))
    //   docType = 'Credit';

    this.accountsService.docType = this.getDocType(this.account?.AccountingDocumentType || this.account?.journalEntryType);
  }

  onInvoiceGen(): void {
    if (!this.isHistoricData) {
      const docDate = this.account.DocumentDate || this.account?.journalEntryDate?.value;
      // if (docDate) {
      //   docDate =
      //     docDate.substr(0, 4) +
      //     '-' +
      //     docDate.substr(4, 2) +
      //     '-' +
      //     docDate.substr(6, 2);
      // }

      const docType = this.getDocType(this.account?.AccountingDocumentType || this.account?.journalEntryType);
      const docNumber = docType == 'REBATE' ? this.account.OriginalReferenceDocument  : this.account.AccountingDocument;



      // Keeping the old code
      // if (this.ifDocDescriptionContains(this.account?.docDescription, 'INVOICE'))
      //   docType = 'INVOICE';
      // if (this.ifDocDescriptionContains(this.account?.docDescription, 'Credit'))
      //   docType = 'CREDITMEMO';
      // if (this.ifDocDescriptionContains(this.account?.docDescription, 'Debit'))
      //   docType = 'DEBITMEMO';
      // if (this.ifDocDescriptionContains(this.account?.docDescription, 'Rebate'))
      //   docType = 'REBATE';

      this.accountsService
        .downloadPDF(docType, docDate, docNumber)
        .subscribe((res: any) => {
          this.blob = new Blob([res], { type: 'application/pdf' });
          this.disableIcon = this.blob.size == 0 ? true : false;
          var downloadURL = window.URL.createObjectURL(res);
          this.invoiceGenRes = downloadURL;
          this.isInvoiceGen = true;
        });
    }
    else {
      let docDate = this.account?.journalEntryDate?.value || this.account?.StatementDate?.split(" ")?.join("-");
      let docNumber = this.account?.docUuid;
      let docType = this.getDocType(this.account?.journalEntryType || this.account?.AccountingDocumentType);
      this.accountsService
        .downloadPDF(docType, docDate, docNumber, this.isHistoricData)
        .subscribe((res: any) => {
          this.blob = new Blob([res], { type: 'application/pdf' });
          this.disableIcon = this.blob.size == 0 ? true : false;
          var downloadURL = window.URL.createObjectURL(res);
          this.invoiceGenRes = downloadURL;
          this.isInvoiceGen = true;
        });
    }

  }

  ifDocDescriptionContains(objContains: any, strMatch: string): boolean {
    let description = strMatch?.toLowerCase();
    let objCont = objContains?.toLowerCase();

    return objCont?.includes(description);
  }


  getDocType(status: any): string {
    switch (status) {
      case 'RV':
      case 'DR':
      case 'INV':
      case 'UR':
        return 'INVOICE';
      case 'ZN':
      case 'DG':
      case 'CRE':
        return 'CREDITMEMO';
      case 'ZD':
      case 'DEB':
        return 'DEBITMEMO';
      case 'ZW':
      case 'REB':
        return 'REBATE';
    }
  }
  generateName(status: any, type: boolean = false): string {
    // OLD EXISTING CODE LEAVING AS IT IS FOR FUTURE USE
    // if (this.ifDocDescriptionContains(status, 'Credit')) return 'Credit Note';
    // if (this.ifDocDescriptionContains(status, 'Invoice')) return 'Invoice';
    // if (this.ifDocDescriptionContains(status, 'Debit')) return 'Debit Note';
    // if (this.ifDocDescriptionContains(status, 'Rebate')) return 'Rebate';
    // switch (status) {
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
      case 'inv':
      case 'rv':
      case 'dr':
      case 'ur':
        return type ? 'Account Invoices' : 'Invoice';
      case 'cre':
      case 'zn':
      case 'dg':
        return type ? 'Credit Notes' : 'Credit Note';
      case 'deb':
      case 'zd':
        return type ? 'Debit Notes' : 'Debit Note';
      case 'reb':
      case 'zw':
        return type ? 'Rebates' : 'Rebate';
    }
    if (this.isStatements) {
      return 'Statements';
    }
  }


  // generatePFDIcoNames(status: any): string {
  //   if (this.ifDocDescriptionContains(status, 'Credit')) return 'Credit PDF';
  //   if (this.ifDocDescriptionContains(status, 'Invoice')) return 'Invoice PDF';
  //   if (this.ifDocDescriptionContains(status, 'Debit')) return 'Debit PDF';
  //   if (this.ifDocDescriptionContains(status, 'Rebate')) return 'Rebate PDF';
  // }

  onOpenStatement(): void {
    window.open(this.invoiceGenRes, '_blank');
  }


  isNullOrEmpty(value: any) {
    return value == '' || value == null || typeof value == 'undefined' || value == 'undefined';
  }


  getCurrentStatus() {
    if (this.account?.InProgress) {
      return 'In-Progress';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '2' && this.isNullOrEmpty(this.account?.SpecialGeneralLedgerCode) && this.account?.IsDueNet == 'X') {
      return 'Overdue';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '2' && this.isNullOrEmpty(this.account?.SpecialGeneralLedgerCode) && !this.isNullOrEmpty(this.account?.DisputeCaseUUID) && !this.isNullOrEmpty(this.account?.DisputeCaseStatus)) {
      return 'Disputed';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '2' && (this.isNullOrEmpty(this.account?.IsDueNet) || this.account?.IsDueNet == 'X')) {
      return 'Outstanding';
    } else if (this.account?.CompanyCode == '5010' && this.account?.ClearingStatus?.toString() == '1' && this.isNullOrEmpty(this.account?.SpecialGeneralLedgerCode) && !this.isNullOrEmpty(this.account?.ClearingAccountingDocument) && this.isNullOrEmpty(this.account?.IsClearingReversed)) {
      return 'Paid';
    } else {
      return 'In-Progress';
    }
  }

  getBillingDate(date: string): string {
    return date.substr(6, 2) + '-' + date.substr(4, 2) + '-' + date.substr(0, 4)
  }
}
