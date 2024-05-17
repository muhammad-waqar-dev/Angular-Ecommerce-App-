import { createAccountFormConstants, helpWithProductOptionConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service'
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';

@Component({
  selector: 'app-product-help-popup',
  templateUrl: './product-help-popup.component.html',
  styleUrls: ['./product-help-popup.component.scss']
})
export class ProductHelpPopupComponent implements OnInit, OnDestroy {

  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  createAccountFormConstants = createAccountFormConstants;
  numpattern = '[0-9]*$';
  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNumberCheck: boolean = false;
  dropDownCheck: boolean = false;
  isMobile: boolean = CommonUtils.isMobile();
  selectedAccount: any;
  popupThankYouMessage = popupThankYouMessage;
  formDefaultData = {
    email: null,
    name: null,
    phoneNumber: '',
    accountNumber: null,
    accountName: null,
    contactReason: '',
    queryType: "Unable to find product"
  }
  private subscription = new Subscription();
  user$: Observable<User | undefined>
  helpWithProductForm: UntypedFormGroup;
  @ViewChild('contactCustomerServiceModal', { static: true }) contactCustomerServiceModal;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  helpWithProductOptionConstants = helpWithProductOptionConstants;

  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private productHelpService: ProductHelpService,
    private accountDropDownStateService: AccountDropDownStateService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService) {
  }

  ngOnInit() {
    this.initializeForm();
    //Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.helpWithProductSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
      //console.log("selAccount tt", selAccount)
    }));

    this.subscription.add(this.shareEvents.productFormMTOreceiveEvent().subscribe(() => {
      this.openPopup();
    }))

  }

  openPopup() {
    this.populateFieldsData();
    this.helpWithProductForm.patchValue(this.formDefaultData);
    this.modalService
      .open(this.contactCustomerServiceModal, { centered: true, windowClass: 'helpWithProductForm', size: 'lg' })
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
  }

  populateFieldsData() {
    let phoneNumber = '';

    if(this.accountDropDownStateService.getAccountPhoneNum !== 'undefined'){
      phoneNumber = this.accountDropDownStateService.getAccountPhoneNum;
    }

    this.formDefaultData.name = this.accountDropDownStateService?.userdisplayName;
    this.formDefaultData.accountName = this.selectedAccount?.name
    this.formDefaultData.email = this.accountDropDownStateService?.getAccountEmailId;
    this.formDefaultData.accountNumber = this.selectedAccount?.uid;
    this.formDefaultData.phoneNumber = phoneNumber;

    if ((sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
      this.formDefaultData.name = localStorage.getItem("name");
      this.formDefaultData.accountName = sessionStorage.getItem("fbCSRTradeAccName");
      this.formDefaultData.email = localStorage.getItem("emailID");
      this.formDefaultData.accountNumber = sessionStorage.getItem("fbCSRTradeAcc");
      if(localStorage.getItem("phoneNum") !== "undefined" && localStorage.getItem("phoneNum") !== "") {
        this.formDefaultData.phoneNumber = localStorage.getItem("phoneNum");
      } else {
        this.formDefaultData.phoneNumber = "";
      }
    }
  }

  initializeForm() {
    this.helpWithProductForm = this.fb.group(
      {
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        name: new UntypedFormControl('', [Validators.required]),
        phoneNumber: new UntypedFormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
        accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
        accountName: new UntypedFormControl('', [Validators.required]),
        additionalInfo: new UntypedFormControl(''),
        queryType: new UntypedFormControl("1", [Validators.required])
      }
    );
    this.helpWithProductForm.controls.queryType.markAsDirty();
    this.formValidationCheck();
  }

  formValidationCheck() {
    if (this.getCommonFieldsValidation() || this.isNullOrEmpty(this.helpWithProductForm.value.accountNumber || this.isNullOrEmpty(this.helpWithProductForm.value.accountName))
      || this.isNullOrEmpty(this.helpWithProductForm.value.queryType)) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.helpWithProductForm.value.email) || this.isNullOrEmpty(this.helpWithProductForm.value.name))
  }


  submit($event) {
    var isFormDataInvalid = false;
    if (this.helpWithProductForm.controls.phoneNumber.errors) {
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.helpWithProductForm.value.email)) {
      this.emailCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.helpWithProductForm.value.name)) {
      this.nameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.helpWithProductForm.value.accountName)) {
      this.companyNameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.helpWithProductForm.value.accountNumber)) {
      this.accountNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.helpWithProductForm.value.queryType)) {
      this.dropDownCheck = true;
      isFormDataInvalid = true;
    }

    if (!isFormDataInvalid) {
      this.thankYouPopUp();
    }
  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.helpWithProductForm.reset();
    this.modalService.dismissAll();
    this.emailInputVal();
    this.nameInputVal();
    this.companyNameInputVal();
    this.accountNumberCheckInputVal();
    this.dropDownCheckSelectVal();
  }

  thankYouPopUp() {
    this.subscription.add(this.productHelpService.sendProductHelpInquiry(JSON.stringify(this.helpWithProductForm.value)).subscribe(responseData => {
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
    this.resetAndCloseForm();
  }

  validatePhoneNum() {
    return (!this.helpWithProductForm.get('phoneNumber').valid && this.helpWithProductForm.get('phoneNumber').touched);
  }

  dropDownCheckSelectVal() {
    this.dropDownCheck = false;
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
