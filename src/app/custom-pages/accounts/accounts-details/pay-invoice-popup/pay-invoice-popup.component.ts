import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createAccountFormConstants, DisputeInvoiceConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Observable, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import {
  accountConstants,
  genericConstants,
} from 'src/app/core/constants/general';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pay-invoice-popup',
  templateUrl: './pay-invoice-popup.component.html',
  styleUrls: ['./pay-invoice-popup.component.scss'],
})
export class PayInvoicePopupComponent implements OnInit, OnDestroy {
  isLoading$ = new BehaviorSubject<boolean>(true);

  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  createAccountFormConstants = createAccountFormConstants;
  numpattern = '[0-9]*$';
  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNumberCheck: boolean = false;
  invoiceNumberCheck: boolean = false;
  dropDownCheck: boolean = false;
  isShowReviewSection: boolean = false;
  isMobile: boolean = CommonUtils.isMobile();
  selectedAccount: any;
  paymentIframe: boolean = false;
  ErrorMsgText = '';
  subtotal: any = 0;
  creditRebate: any = 0;
  total: any = 0;
  isButtonsDisabled = false;
  @Input() isHistoricData: boolean;

  documentSelectionHeadingText = '';
  isShowTimeOutMessage: boolean = false;
  timeOutMessage: string =
    'Your request timed out. Before attempting to pay again Please contact our Accounts Receivable team on 1300 728 886 ';

  // If Credit notes & Rebates amount is greater than Debit Note Subtotal amount, throw an error and do not allow customer to process the payment
  debitNoteErrorMsg = 'Please contact accounts receivable to make this payment';
  isShowDebitNoteErrorMsg = false;
  billingDocumentState = [];

  payment_method: string = 'credit-card';

  isInternalStaff: boolean = false;

  private subscription = new Subscription();
  private user$: Observable<User | undefined>;

  @ViewChild('payInvoiceServiceModal', { static: true })
  payInvoiceServiceModal: any;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  DisputeInvoiceConstants = DisputeInvoiceConstants;
  accountConstants = accountConstants;
  popupThankYouMessage = popupThankYouMessage;
  invoiceNumberList: Array<{}>;
  @Input('isShow') isShow: boolean;
  @Input() isMakePayment: boolean = false;
  @Input('data') account: any = {};
  data: any = {};
  otpSendInfoforTransaction: any;
  billingNotes = [];
  billingNotesAppliedState = [];
  isChkboxDisabled = false;

  constructor(
    private modalService: NgbModal,
    public accountService: AccountsService,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private productHelpService: ProductHelpService,
    private paymentService: PaymentService,
    private accountDropDownStateService: AccountDropDownStateService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService
  ) {
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    this.initBillingDocumentState();
    this.isLoading$.next(true);

    this.initText();

    // Receive Event for Contact Customer Service Popup Event
    this.subscription.add(
      this.shareEvents.payInvoiceSubjectReceiveEvent().subscribe(() => {
        this.openPopup();
        this.getAccountsData();
      })
    );

    this.subscription.add(
      this.accountDropDownStateService._getSelectedAccountState$.subscribe(
        (selAccount) => {
          this.selectedAccount = selAccount.selectedAccount;
        }
      )
    );

    if (
      sessionStorage.getItem('fbCSRTradeAcc') &&
      sessionStorage.getItem('internalUserState') == 'false'
    ) {
      this.isInternalStaff = true;
    }
  }

  initBillingDocumentState() {
    this.billingDocumentState[0] = true; //overdue
    this.billingDocumentState[1] = true; //outstanding
    this.billingDocumentState[2] = true; //credit
  }

  initText() {
    if (this.isMakePayment) {
      this.documentSelectionHeadingText = 'Select Billing Documents';
    } else {
      this.documentSelectionHeadingText = 'Apply Credit Notes & Rebates';
    }
  }
  onPopupOpenClick() {
    this.shareEvents.payInvoiceSubjectSendEvent();
  }

  openPopup() {
    // added status isReceived to check if true then popup will be opened
    if (this.isShow) {
      this.modalService
        .open(this.payInvoiceServiceModal, {
          centered: true,
          windowClass: 'payment-content',
          size: 'lg',
        })
        .result.then(
          (result) => {
            this.resetAndCloseForm();
            if (
              this.shareEvents.otp !== null &&
              this.shareEvents.otp !== '' &&
              this.shareEvents.otp !== undefined
            ) {
              window.location.reload();
            }
          },
          (reason) => {
            this.resetAndCloseForm();
            if (
              this.shareEvents.otp !== null &&
              this.shareEvents.otp !== '' &&
              this.shareEvents.otp !== undefined
            ) {
              window.location.reload();
            }
            setTimeout(() => {
              window.scroll(0, 0);
            }, 100);
          }
        );
    } else {
      // do nothing
    }
  }

  callTransactionDetailPayment() {
    this.paymentService
      .getAccountTransactionDetail(this.otpSendInfoforTransaction)
      .subscribe((transactionData) => {
        // window.location.reload();
      });
  }

  getAccountsData() {
    this.accountService.getAccountDataForPayments().subscribe((data) => {
      this.isLoading$.next(false);

      const accountResult = data.results.value;
      const accountSummaryData = JSON.parse(accountResult)?.d?.results;
      this.billingNotes = accountSummaryData;

      this.billingNotes?.forEach((n) => {
        n.isShowNote = true;
        n.individualStateShow = true;
      });

      if (!this.isMakePayment) {
        this.billingNotes = this.billingNotes.filter((p: any) => {
          return (
            p?.AccountingDocumentType == 'ZN' ||
            p?.AccountingDocumentType == 'DG' ||
            p?.AccountingDocumentType == 'ZW'
          );
        });
      }
    });
  }

  generateName(status: any): string {
    switch (status?.toLowerCase()) {
      case 'inv':
      case 'rv':
      case 'dr':
      case 'ur':
        return 'Invoice';
      case 'cre':
      case 'zn':
      case 'dg':
        return 'Credit';
      case 'deb':
      case 'zd':
        return 'Debit';
      case 'reb':
      case 'zw':
        return 'Rebate';
    }
  }

  isNullOrEmpty(value: any) {
    return value == '' || value == null || typeof value == 'undefined' || value == 'undefined';
  }


  getCurrentStatus(currentAccountDetails: any): any {
    if (currentAccountDetails?.InProgress) {
      return 'In-progress';
    } else if (currentAccountDetails?.CompanyCode == '5010' && currentAccountDetails?.ClearingStatus?.toString() == '2' && this.isNullOrEmpty(currentAccountDetails?.SpecialGeneralLedgerCode) && currentAccountDetails?.IsDueNet == 'X') {
      return 'Overdue';
    } else if (currentAccountDetails?.CompanyCode == '5010' && currentAccountDetails?.ClearingStatus?.toString() == '2' && this.isNullOrEmpty(currentAccountDetails?.SpecialGeneralLedgerCode) && !this.isNullOrEmpty(currentAccountDetails?.DisputeCaseUUID) && !this.isNullOrEmpty(currentAccountDetails?.DisputeCaseStatus)) {
      return 'Disputed';
    } else if (currentAccountDetails?.CompanyCode == '5010' && currentAccountDetails?.ClearingStatus?.toString() == '2' && (this.isNullOrEmpty(currentAccountDetails?.IsDueNet) || currentAccountDetails?.IsDueNet == 'X')) {
      return 'Outstanding';
    } else if (currentAccountDetails?.CompanyCode == '5010' && currentAccountDetails?.ClearingStatus?.toString() == '1' && this.isNullOrEmpty(currentAccountDetails?.SpecialGeneralLedgerCode) && !this.isNullOrEmpty(currentAccountDetails?.ClearingAccountingDocument) && this.isNullOrEmpty(currentAccountDetails?.IsClearingReversed)) {
      return 'Paid';
    } else {
      return 'In-Progress';
    }
  }


  canBillingDocBeToggled(status: any) {
    if (status === 'Overdue') {
      if (
        this.billingDocumentState[0] &&
        !this.billingDocumentState[1] &&
        !this.billingDocumentState[2]
      ) {
        return false;
      } else {
        this.billingDocumentState[0] = !this.billingDocumentState[0];
      }
    } else if (status === 'Outstanding') {
      if (!this.billingDocumentState[0] && !this.billingDocumentState[2]) {
        this.billingDocumentState[0] = true;
        this.billingDocumentState[1] = !this.billingDocumentState[1];
      } else {
        this.billingDocumentState[1] = !this.billingDocumentState[1];
      }
    } else if (status === 'Credit') {
      if (!this.billingDocumentState[0] && !this.billingDocumentState[1]) {
        this.billingDocumentState[0] = true;
        this.billingDocumentState[2] = !this.billingDocumentState[2];
      } else {
        this.billingDocumentState[2] = !this.billingDocumentState[2];
      }
    }

    return true;
  }

  toggleStateBulk(status: any) {
    if (this.canBillingDocBeToggled(status)) {
      switch (status) {
        case 'Overdue':
          this.billingNotes.forEach((p) => {
            if (
              this.getCurrentStatus(p) === 'Overdue' &&
              (p?.AccountingDocumentType == 'RV' ||
                p?.AccountingDocumentType == 'DR' ||
                p?.AccountingDocumentType == 'ZD')
            ) {
              p.isShowNote = !p.isShowNote;
            }
          });

          break;
        case 'Outstanding':
          this.billingNotes.forEach((p) => {
            if (
              this.getCurrentStatus(p) === 'Outstanding' &&
              (p?.AccountingDocumentType == 'RV' ||
                p?.AccountingDocumentType == 'DR' ||
                p?.AccountingDocumentType == 'ZD')
            ) {
              p.isShowNote = !p.isShowNote;
            }
          });

          break;

        case 'Credit':
          this.billingNotes.forEach((p) => {
            if (
              this.getCurrentStatus(p) === 'Outstanding' &&
              (p?.AccountingDocumentType == 'ZN' ||
                p?.AccountingDocumentType == 'DG' ||
                p?.AccountingDocumentType == 'ZW')
            ) {
              p.isShowNote = !p.isShowNote;
            }
          });

          break;
      }
    }
  }

  toggleIndividualState(i: any) {
    this.billingNotes[i].individualStateShow =
      !this.billingNotes[i].individualStateShow;
  }

  applyBillingNotes() {
    this.isShowReviewSection = true;
    this.billingNotesAppliedState = JSON.parse(
      JSON.stringify(this.billingNotes)
    );

    if (this.isMakePayment) {
      this.calculateTotalsForMakePayment();
    } else {
      this.calculateTotalsForPayInvoice();
    }
  }

  calculateTotalsForPayInvoice() {
    this.creditRebate = 0;
    this.total = 0;

    this.invoiceNumberList = [];

    //case invoice is avilable
    this.billingNotesAppliedState.forEach((k) => {
      if (
        k?.isShowNote &&
        k?.individualStateShow &&
        this.billingNotesAppliedState.length
      ) {
        let invoiceObject = {
          code: k?.AccountingDocument,
          amount: k?.AmountInCompanyCodeCurrency?.toString(),
          status: this.getCurrentStatus(k),
        };
        this.invoiceNumberList.push(invoiceObject);
        if (
          k?.AccountingDocumentType == 'ZN' ||
          k?.AccountingDocumentType == 'DG' ||
          k?.AccountingDocumentType == 'ZW'
        ) {
          this.creditRebate = this.creditRebate + parseFloat(k?.AmountInCompanyCodeCurrency);
        }
      }
    });

    const invoiceObjectSelected = {
      code: this.accountService?.invoicePaymentObject?.AccountingDocument,
      amount:
        this.accountService?.invoicePaymentObject?.AmountInCompanyCodeCurrency?.toString(),
      status: this.accountService?.invoicePaymentObject?.ClearingStatus,
    };

    this.invoiceNumberList.push(invoiceObjectSelected);
    this.subtotal = parseFloat(this.accountService?.invoicePaymentSubTotal?.toString())?.toFixed(2);
    this.creditRebate = parseFloat(this?.creditRebate)?.toFixed(2);
    this.total = parseFloat(this.subtotal) + parseFloat(this.creditRebate);
    this.total = parseFloat(this?.total)?.toFixed(2);

    if (this.creditRebate > this.subtotal) {
      this.isShowDebitNoteErrorMsg = true;
    }
  }

  calculateTotalsForMakePayment() {
    this.subtotal = 0;
    this.creditRebate = 0;
    this.total = 0;

    this.invoiceNumberList = [];
    this.billingNotesAppliedState.forEach((k) => {
      if (k?.isShowNote && k?.individualStateShow) {
        let invoiceObject = {
          code: k?.AccountingDocument,
          amount: k?.AmountInCompanyCodeCurrency?.toString(),
          status: this.getCurrentStatus(k),
        };
        this.invoiceNumberList.push(invoiceObject);

        // at times API is sending Debit Memo and at times Debit Return, so covering the known cases
        //same applies to Credit Return and Memo as well

        if (
          k?.AccountingDocumentType == 'RV' ||
          k?.AccountingDocumentType == 'DR' ||
          k?.AccountingDocumentType == 'ZD' ||
          k?.AccountingDocumentType == 'UR'
        ) {
          this.subtotal = this.subtotal + parseFloat(k?.AmountInCompanyCodeCurrency);
        }
        if (
          k?.AccountingDocumentType == 'ZN' ||
          k?.AccountingDocumentType == 'DG' ||
          k?.AccountingDocumentType == 'ZW'
        ) {
          this.creditRebate = this.creditRebate + parseFloat(k?.AmountInCompanyCodeCurrency);
        }
      }
    });

    //this.subtotal = parseFloat(this.subtotal?.toFixed(2));
    this.subtotal = parseFloat(this.subtotal)?.toFixed(2);
    this.creditRebate = parseFloat(this.creditRebate)?.toFixed(2);
    this.total = parseFloat(this.subtotal) + parseFloat(this.creditRebate);
    this.total = parseFloat(this.total)?.toFixed(2);
  }

  payInvoice() {
    let invoiceListVal: any;
    if (this.isMakePayment) {
      invoiceListVal = this.invoiceNumberList;
    } else {
      invoiceListVal = this.invoiceNumberList;
    }

    let paymentData = {
      customer: this.selectedAccount?.uid,
      invoice: invoiceListVal,
      paymentAmount: this.total?.toString(),
      status: '',
      user: this.accountDropDownStateService?.getAccountEmailId,
    };

    this.paymentService.getAccountTransactionOtp(paymentData).subscribe(
      (otpData) => {
        this.isButtonsDisabled = true;
        this.shareEvents.otp = otpData.transactionReference;
        this.paymentIframe = true;
        this.otpSendInfoforTransaction = otpData;
        sessionStorage.setItem('transOTP', JSON.stringify(otpData));
        this.subscription.add(
          interval(360000).subscribe((x) => {
            if (
              sessionStorage.getItem('transOTP') !== '' &&
              sessionStorage.getItem('transOTP') !== undefined
            ) {
              sessionStorage.removeItem('transOTP');
            }
          })
        );
      },
      (error) => {
        this.ErrorMsgText = error.error.errors[0].message;
      }
    );
  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.modalService.dismissAll();
    this.emptyState();
  }

  ngOnDestroy() {
    if (
      sessionStorage.getItem('transOTP') !== '' &&
      sessionStorage.getItem('transOTP') !== undefined
    ) {
      sessionStorage.removeItem('transOTP');
    }
    this.subscription.unsubscribe();
    this.resetAndCloseForm();
  }

  ifDocDescriptionContains(objContains: any, strMatch: string) {
    let description = strMatch?.toLowerCase();
    let objCont = objContains?.toLowerCase();
    return objCont?.includes(description);
  }

  generateBtnName(status: any, type?: any): string {
    switch (status) {
      case 'RV':
      case 'DR':
      case 'UR':
      case 'Invoice':
      case 'INV':
        return type == 'status' ? 'Invoice' : 'Pay an Invoice';
      case 'ZN':
      case 'DG':
      case 'Credit':
        return type == 'status' ? 'Credit' : 'Pay a Credit Note';
      case 'ZD':
      case 'Debit':
        return type == 'status' ? 'Debit' : 'Pay a Debit Note';
      case 'ZW':
      case 'Rebate':
        return type == 'status' ? 'Rebate' : 'Pay a Rebate';
    }
  }

  generateStatusTerm(status: any): string {
    switch (status) {
      case 'RV':
      case 'DR':
      case 'UR':
        return 'Invoice';
      case 'ZN':
      case 'DG':
        return 'Credit Note';
      case 'ZD':
        return 'Debit Note';
      case 'ZW':
        return 'Rebate';
    }
  }

  emptyState() {
    this.billingNotes = [];
    this.billingNotesAppliedState = [];
    this.subtotal = 0;
    this.creditRebate = 0;
    this.total = 0;
    this.paymentIframe = false;
    this.isShowReviewSection = false;
    this.isButtonsDisabled = false;
    this.isLoading$.next(true);
    this.isShowDebitNoteErrorMsg = false;
    clearTimeout(0);
  }
}