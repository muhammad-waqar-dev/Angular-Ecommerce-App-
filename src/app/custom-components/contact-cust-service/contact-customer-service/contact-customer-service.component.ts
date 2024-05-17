import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { createAccountFormConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { SendNoteService } from 'src/app/core/service/sendNoteSevice.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
@Component({
  selector: 'app-contact-customer-service',
  templateUrl: './contact-customer-service.component.html',
  styleUrls: ['./contact-customer-service.component.scss']
})
export class ContactCustomerServiceComponent implements OnInit, OnDestroy {

  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  createAccountFormConstants = createAccountFormConstants;
  numpattern = '[0-9]*$';
  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNumberCheck: boolean = false;
  popupThankYouMessage = popupThankYouMessage;
  formDefaultData = {
    email: '',
    name: '',
    phoneNumber: '',
    accountNumber: '',
    accountName: ''
  }

  private subscription = new Subscription();
  private user$: Observable<User | undefined>

  contactCSRForm: UntypedFormGroup;
  @ViewChild('contactCustomerServiceModal', { static: true }) contactCustomerServiceModal;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  selectedAccount: any;

  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private sendNoteService: SendNoteService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,
    private accountDropDownStateService: AccountDropDownStateService) {
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    this.initializeForm();

    //Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.contactCustomerServicePopupReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }

  populateFieldsData() {
    let phone = '';
    if(this.accountDropDownStateService.getAccountPhoneNum !== 'undefined') {
      phone = this.accountDropDownStateService?.getAccountPhoneNum;
    }
    this.formDefaultData.name = this.accountDropDownStateService.userdisplayName;
    this.formDefaultData.accountName = this.selectedAccount.name
    this.formDefaultData.email = this.accountDropDownStateService.getAccountEmailId;
    this.formDefaultData.accountNumber = this.selectedAccount.uid;
    this.formDefaultData.phoneNumber = phone;
  }

  populateInternalStaffFieldsData() {
    let phone = '';
    if(localStorage.getItem("phoneNum") !== "undefined" && localStorage.getItem("phoneNum") !== "") {
      phone = localStorage.getItem("phoneNum");
    } else {
      phone = "";
    }
    this.formDefaultData.name = localStorage.getItem("name");
    this.formDefaultData.accountName = sessionStorage.getItem("fbCSRTradeAccName");
    this.formDefaultData.email = localStorage.getItem("emailID");
    this.formDefaultData.accountNumber = sessionStorage.getItem("fbCSRTradeAcc");
    this.formDefaultData.phoneNumber = phone;
  }

  openPopup() {
    if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
    this.populateFieldsData();
    }
    else {
      this.populateInternalStaffFieldsData();
    }
    this.contactCSRForm.patchValue(this.formDefaultData);
    this.modalService
      .open(this.contactCustomerServiceModal, { centered: true, windowClass: 'contactCSRForm', size: 'lg' })
      .result.then(
        (result) => {
          this.resetAndCloseForm();
        },
        (reason) => {
          this.resetAndCloseForm();
        }
      );
  }

  initializeForm() {
    this.contactCSRForm = this.fb.group(
      {
        email: new UntypedFormControl(null, [Validators.required, Validators.email]),
        name: new UntypedFormControl('', [Validators.required]),
        phoneNumber: new UntypedFormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
        accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
        accountName: new UntypedFormControl('', [Validators.required]),
        comments: new UntypedFormControl('')
      }
    );
  }

  formValidationCheck() {
    if (this.getCommonFieldsValidation() || this.isNullOrEmpty(this.contactCSRForm.value.accountNumber || this.isNullOrEmpty(this.contactCSRForm.value.accountName))
    ) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.contactCSRForm.value.email) || this.isNullOrEmpty(this.contactCSRForm.value.name))
  }


  submit($event) {
    var isFormDataInvalid = false;

    if (this.contactCSRForm.controls.phoneNumber.errors) {
      isFormDataInvalid = true;
    }

    if (this.isNullOrEmpty(this.contactCSRForm.value.email)) {
      this.emailCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.contactCSRForm.value.name)) {
      this.nameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.contactCSRForm.value.accountName)) {
      this.companyNameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.contactCSRForm.value.accountNumber)) {
      this.accountNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (!isFormDataInvalid) {
      this.thankYouPopUp();
    }
  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.contactCSRForm.reset();
    this.modalService.dismissAll();
    this.emailInputVal();
    this.nameInputVal();
    this.companyNameInputVal();
    this.accountNumberCheckInputVal();
  }

  thankYouPopUp() {
    this.subscription.add(this.sendNoteService.sendNote(JSON.stringify(this.contactCSRForm.value)).subscribe(responseData => {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  validatePhoneNum() {
    return (!this.contactCSRForm.get('phoneNumber').valid && this.contactCSRForm.get('phoneNumber').touched);
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
