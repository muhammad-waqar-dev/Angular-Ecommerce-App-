import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createAccountFormConstants, DisputeInvoiceConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service'
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { accountConstants, genericConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-dispute-invoice-popup',
  templateUrl: './dispute-invoice-popup.component.html',
  styleUrls: ['./dispute-invoice-popup.component.scss']
})
export class DisputeInvoicePopupComponent implements OnInit {

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
  isMobile: boolean = CommonUtils.isMobile();
  selectedAccount: any;
  popupThankYouMessage = popupThankYouMessage;
  formDefaultData = {
    email: null,
    name: null,
    phoneNumber: '',
    accountNumber: null,
    invoiceNumber: null,
    companyName: null,
    contactReason: '',
    reasonOfDispute: "Unable to find product"
  }
  private subscription = new Subscription();
  private user$: Observable<User | undefined>

  disputeForm: UntypedFormGroup;
  @ViewChild('disputeServiceModal', { static: true }) disputeServiceModal;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  DisputeInvoiceConstants = DisputeInvoiceConstants;
  accountConstants = accountConstants;

  @Input('isShow') isShow: boolean;
  @Input('data') data: any = {};

  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private productHelpService: ProductHelpService,
    private accountService: AccountsService,
    private accountDropDownStateService: AccountDropDownStateService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,) {
      this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    this.initializeForm();
    // Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.disputeInvoiceSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
    this.data.docDescription = this.data.InvoiceReference ? 'Invoice' : this.data.docDescription;
  }

  onPopupOpenClick() {
    this.shareEvents.disputeInvoiceSubjectSendEvent();
  }

  openPopup() {
    // added status isReceived to check if true then popup will be opened
    if (this.isShow) {
      if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
        this.populateFieldsData();
        }
        else {
          this.populateInternalStaffFieldsData();
        }
      this.disputeForm.patchValue(this.formDefaultData);

      this.modalService
        .open(this.disputeServiceModal, { centered: true, windowClass: 'disputeForm', size: 'lg' })
        .result.then(
          (result) => {
            this.resetAndCloseForm();
          },
          (reason) => {
            this.resetAndCloseForm();
            setTimeout(() => {
              window.scroll(0, 0);
            }, 100);
          }
        );
    } else {
      // do nothing
    }
  }

  populateFieldsData() {
    let phoneNumber = '';

    if(this.accountDropDownStateService.getAccountPhoneNum !== 'undefined'){
      phoneNumber = this.accountDropDownStateService.getAccountPhoneNum;
    }
    this.formDefaultData.name = this.accountDropDownStateService.userdisplayName;
    this.formDefaultData.companyName = this.selectedAccount.name
    this.formDefaultData.email = this.accountDropDownStateService.getAccountEmailId;
    this.formDefaultData.accountNumber = this.selectedAccount.uid;
    this.formDefaultData.invoiceNumber = this.data?.InvoiceReference;
    this.formDefaultData.phoneNumber = phoneNumber;


  }

  populateInternalStaffFieldsData() {
    let phoneNumber = '';

    if(this.accountDropDownStateService.getAccountPhoneNum !== 'undefined'){
      phoneNumber = this.accountDropDownStateService.getAccountPhoneNum;
    }
    this.formDefaultData.name = localStorage.getItem("name");
    this.formDefaultData.companyName = sessionStorage.getItem("fbCSRTradeAccName");
    this.formDefaultData.email = localStorage.getItem("emailID");
    this.formDefaultData.accountNumber = sessionStorage.getItem("fbCSRTradeAcc");
    this.formDefaultData.invoiceNumber = this.data?.InvoiceReference;
    this.formDefaultData.phoneNumber = phoneNumber;
  }

  initializeForm() {
    this.disputeForm = this.fb.group(
      {
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        name: new UntypedFormControl('', [Validators.required]),
        phoneNumber: new UntypedFormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
        accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
        companyName: new UntypedFormControl('', [Validators.required]),
        invoiceNumber: new UntypedFormControl(this.data?.InvoiceReference, [Validators.required]),
        additionalInfo: new UntypedFormControl(''),
        reasonOfDispute: new UntypedFormControl("Unable to find product", [Validators.required])
      }
    );
    this.disputeForm.controls.reasonOfDispute.markAsDirty();
    this.formValidationCheck();
  }

  formValidationCheck() {
    if (this.getCommonFieldsValidation() || this.isNullOrEmpty(this.disputeForm.value.accountNumber || this.isNullOrEmpty(this.disputeForm.value.companyName))
      || this.isNullOrEmpty(this.disputeForm.value.reasonOfDispute)) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.disputeForm.value.email) || this.isNullOrEmpty(this.disputeForm.value.name))
  }


  submit($event) {
    var isFormDataInvalid = false;
    if (this.disputeForm.controls.phoneNumber.errors) {
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.disputeForm.value.email)) {
      this.emailCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.disputeForm.value.name)) {
      this.nameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.disputeForm.value.companyName)) {
      this.companyNameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.disputeForm.value.accountNumber)) {
      this.accountNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.disputeForm.value.invoiceNumber)) {
      this.invoiceNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.disputeForm.value.reasonOfDispute)) {
      this.dropDownCheck = true;
      isFormDataInvalid = true;
    }

    if (isFormDataInvalid) {
    }
    else{this.thankYouPopUp();}

  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.disputeForm.reset();
    this.modalService.dismissAll();
    this.emailInputVal();
    this.nameInputVal();
    this.companyNameInputVal();
    this.accountNumberCheckInputVal();
    this.dropDownCheckSelectVal();
  }

  thankYouPopUp() {
    let data = {
      ...this.disputeForm.value,
      referenceNumber: this.data?.CustomerContext?.CustomerPOReference
    }

    this.subscription.add(this.accountService.disputeInvoice(data).subscribe(responseData => {
      if (responseData === "Success") {
        this.responseSuccess = true;
      } else {
        this.responseSuccess = false;
      }
      this.responseOpen = false;
    }, error => {
      this.responseSuccess = false;
      this.responseOpen = false;
    }));
  }

  emailInputVal() {
    this.emailCheck = false;
  }

  nameInputVal() {
    this.nameCheck = false;
  }

  companyNameInputVal() {
    this.companyNameCheck = false;
  }

  accountNumberCheckInputVal() {
    this.accountNumberCheck = false;
  }

  invoiceNumberCheckInputVal() {
    this.invoiceNumberCheck = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.resetAndCloseForm();
  }

  validatePhoneNum() {
    return (!this.disputeForm.get('phoneNumber').valid && this.disputeForm.get('phoneNumber').touched);
  }

  dropDownCheckSelectVal() {
    this.dropDownCheck = false;
  }

  ifDocDescriptionContains(objContains: any, strMatch: string) {
    let description = strMatch?.toLowerCase();
    let objCont = objContains?.toLowerCase();

    return objCont?.includes(description);
  }

  generateBtnName = (status) => {
    if (this.ifDocDescriptionContains(status, 'Credit')) return 'Dispute Credit Note';
    if (this.ifDocDescriptionContains(status, 'Invoice')) return 'Dispute Invoice';
    if (this.ifDocDescriptionContains(status, 'Debit')) return 'Dispute Debit Note';
    if (this.ifDocDescriptionContains(status, 'Rebate')) return 'Dispute Rebate';
  }

  generateFormTerm = (status) => {
    if (this.ifDocDescriptionContains(status, 'Credit')) return 'Credit Note';
    if (this.ifDocDescriptionContains(status, 'Invoice')) return 'Invoice';
    if (this.ifDocDescriptionContains(status, 'Debit')) return 'Debit Note';
    if (this.ifDocDescriptionContains(status, 'Rebate')) return 'Rebate';
  }

  generateInvoiceHeaderName = (status) => {
    if (this.ifDocDescriptionContains(status, 'Credit')) return 'Dispute Credit Note';
    if (this.ifDocDescriptionContains(status, 'Invoice')) return 'Dispute Invoice';
    if (this.ifDocDescriptionContains(status, 'Debit')) return 'Dispute Debit Note';
    if (this.ifDocDescriptionContains(status, 'Rebate')) return 'Dispute Rebate';
  }
  validateChar(event) {
    var regex = new RegExp("^[0-9-+()-]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
  }

}
