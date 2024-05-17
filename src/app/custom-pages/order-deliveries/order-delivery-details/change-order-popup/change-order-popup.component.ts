import { createAccountFormConstants, ChangeOrderConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service'
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { orderDeliveriesConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-change-order-popup',
  templateUrl: './change-order-popup.component.html',
  styleUrls: ['./change-order-popup.component.scss']
})
export class ChangeOrderPopupComponent implements OnInit {

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
    phoneNumber: null,
    accountNumber: null,
    accountName: null,
    contactReason: '',
    requiredChanges: ChangeOrderConstants.deliveryDateChange,
    fiOrderPendingNo: null,
    referenceNumber: null
  }
  private subscription = new Subscription();
  private user$: Observable<User | undefined>

  changeOrderForm: UntypedFormGroup;
  @ViewChild('changeOrderServiceModal', { static: true }) changeOrderServiceModal;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  ChangeOrderConstants = ChangeOrderConstants;
  orderDeliveriesConstants = orderDeliveriesConstants;

  @Input('isStatusReceived') isStatusReceived: boolean;
  @Input('data') data: any;

  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private productHelpService: ProductHelpService,
    private accountDropDownStateService: AccountDropDownStateService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,
    private orderService: OrderDeliveryService,) {
      this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    this.initializeForm();
    
    // Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.changeOrderSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }

  onPopupOpenClick() {
    this.shareEvents.changeOrderSubjectSendEvent();
  }

  openPopup() {
    // added status isReceived to check if true then popup will be opened 
    if (this.isStatusReceived) {
      if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
      this.populateFieldsData();
      }
      else {
        this.populateInternalStaffFieldsData();
      }
      
      this.changeOrderForm.patchValue(this.formDefaultData);

      this.modalService
        .open(this.changeOrderServiceModal, { centered: true, windowClass: 'changeOrderForm', size: 'lg' })
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
    // this.formDefaultData.phone = this.accountDropDownStateService.getAccountPhoneNum;
    this.formDefaultData.name = this.accountDropDownStateService.userdisplayName;
    this.formDefaultData.accountName = this.selectedAccount.name
    this.formDefaultData.email = this.accountDropDownStateService.getAccountEmailId;
    this.formDefaultData.accountNumber = this.selectedAccount.uid;
    this.formDefaultData.phoneNumber = phoneNumber;
    this.formDefaultData.fiOrderPendingNo = this.data?.code;
    this.formDefaultData.referenceNumber = this.data?.purchaseOrderNumber;
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
    this.formDefaultData.fiOrderPendingNo = this.data?.code;
    this.formDefaultData.referenceNumber = this.data?.purchaseOrderNumber;
  }

  initializeForm() {
    this.changeOrderForm = this.fb.group(
      {
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        name: new UntypedFormControl('', [Validators.required]),
        phoneNumber: new UntypedFormControl(''),
        accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
        accountName: new UntypedFormControl('', [Validators.required]),
        additionalInfo: new UntypedFormControl(''),
        requiredChanges: new UntypedFormControl(ChangeOrderConstants.deliveryDateChange, [Validators.required]),
        fiOrderPendingNo: new UntypedFormControl('', [Validators.required]),
        referenceNumber: new UntypedFormControl('', [Validators.required]),
      }
    );
    this.changeOrderForm.controls.requiredChanges.markAsDirty();
    this.formValidationCheck();
  }

  formValidationCheck() {
    if (this.getCommonFieldsValidation() || this.isNullOrEmpty(this.changeOrderForm.value.accountNumber || this.isNullOrEmpty(this.changeOrderForm.value.accountName))
      || this.isNullOrEmpty(this.changeOrderForm.value.requiredChanges)) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.changeOrderForm.value.email) || this.isNullOrEmpty(this.changeOrderForm.value.name))
  }


  submit($event) {
    this.responseSuccess = true;

    var isFormDataInvalid = false;

    if (this.isNullOrEmpty(this.changeOrderForm.value.email)) {
      this.emailCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.changeOrderForm.value.name)) {
      this.nameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.changeOrderForm.value.accountName)) {
      this.companyNameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.changeOrderForm.value.accountNumber)) {
      this.accountNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.changeOrderForm.value.requiredChanges)) {
      this.dropDownCheck = true;
      isFormDataInvalid = true;
    }

    if (!isFormDataInvalid) {
      this.thankYouPopUp();
    }
  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.changeOrderForm.reset();
    this.modalService.dismissAll();
    this.emailInputVal();
    this.nameInputVal();
    this.companyNameInputVal();
    this.accountNumberCheckInputVal();
    this.dropDownCheckSelectVal();
  }

  thankYouPopUp() {
    let data = {
      ...this.changeOrderForm.value,
      orderNumber: this.data.code,
      orderLabel: this.data.status == 'PENDING' ? orderDeliveriesConstants.orderPendingNoTh: orderDeliveriesConstants.fIOrderNoTh,
      purchaseOrderNumber: this.data.purchaseOrderNumber,
    }

    this.subscription.add(this.orderService.changeDetailOrder(JSON.stringify(data)).subscribe(responseData => {
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
    return (!this.changeOrderForm.get('phoneNumber').valid && this.changeOrderForm.get('phoneNumber').touched);
  }

  dropDownCheckSelectVal() {
    this.dropDownCheck = false;
  }

}
