import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createAccountFormConstants, RequestForPODConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service'
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';

@Component({
  selector: 'app-request-for-pod-popup',
  templateUrl: './request-for-pod-popup.component.html',
  styleUrls: ['./request-for-pod-popup.component.scss']
})
export class RequestForPodPopupComponent implements OnInit {

  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  createAccountFormConstants = createAccountFormConstants;
  numpattern = '[0-9]*$';
  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNumberCheck: boolean = false;
  invoiceNumberCheck: boolean = false;
  isMobile: boolean = CommonUtils.isMobile();
  selectedAccount: any;
  popupThankYouMessage = popupThankYouMessage;
  formDefaultData = {
    email: null,
    name: null,
    phone: '',
    accountNumber: null,
    companyName: null,
    invoice: null,
    documentNumber: null,
    documentType: 'Order',
    contactReason: '',
  }
  private subscription = new Subscription();
  private user$: Observable<User | undefined>

  requestForPodForm: UntypedFormGroup;
  @ViewChild('requestForPodModal', { static: true }) requestForPodModal;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  requestForPODConstants = RequestForPODConstants;

  @Input('isShow') isShow: boolean;
  @Input('data') data: boolean;

  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private orderService: OrderDeliveryService,
    private accountDropDownStateService: AccountDropDownStateService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,) {
      this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    this.initializeForm();
    
    // Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.requestForPODSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }

  onPopupOpenClick() {
    this.shareEvents.requestForPODSubjectSendEvent();
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
      this.requestForPodForm.patchValue(this.formDefaultData);

      this.modalService
        .open(this.requestForPodModal, { centered: true, windowClass: 'requestForPodForm', size: 'lg' })
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
    this.formDefaultData.name = this.accountDropDownStateService.userdisplayName;
    this.formDefaultData.companyName = this.selectedAccount.name
    this.formDefaultData.email = this.accountDropDownStateService.getAccountEmailId;
    this.formDefaultData.accountNumber = this.selectedAccount.uid;
    this.formDefaultData.invoice = this.data['code'];
    this.formDefaultData.documentNumber = this.data['code'];
    this.formDefaultData.documentType = 'Order';
  }

  populateInternalStaffFieldsData() {
    this.formDefaultData.name = localStorage.getItem("name");
    this.formDefaultData.companyName = sessionStorage.getItem("fbCSRTradeAccName");
    this.formDefaultData.email = localStorage.getItem("emailID");
    this.formDefaultData.accountNumber = sessionStorage.getItem("fbCSRTradeAcc");
    this.formDefaultData.invoice = this.data['code'];
    this.formDefaultData.documentNumber = this.data['code'];
    this.formDefaultData.documentType = 'Order';
  }

  initializeForm() {
    this.requestForPodForm = this.fb.group(
      {
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        name: new UntypedFormControl('', [Validators.required]),
        phone: new UntypedFormControl('', [Validators.pattern(this.numpattern), Validators.minLength(9), Validators.maxLength(10)]),
        accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
        companyName: new UntypedFormControl('', [Validators.required]),
        invoice: new UntypedFormControl('', [Validators.required]),
        documentNumber: new UntypedFormControl('', [Validators.required]),
        documentType: new UntypedFormControl('', [Validators.required]),
        additionalInfo: new UntypedFormControl(''),
      }
    );
    this.formValidationCheck();
  }

  formValidationCheck() {
    if (this.getCommonFieldsValidation() || this.isNullOrEmpty(this.requestForPodForm.value.accountNumber || this.isNullOrEmpty(this.requestForPodForm.value.companyName))) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.requestForPodForm.value.email) || this.isNullOrEmpty(this.requestForPodForm.value.name))
  }


  submit($event) {
    this.responseOpen = true;
    this.responseSuccess = true;
    
    var isFormDataInvalid = false;

    if (this.isNullOrEmpty(this.requestForPodForm.value.email)) {
      this.emailCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.requestForPodForm.value.name)) {
      this.nameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.requestForPodForm.value.companyName)) {
      this.companyNameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.requestForPodForm.value.accountNumber)) {
      this.accountNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.requestForPodForm.value.invoice)) {
      this.invoiceNumberCheck = true;
      isFormDataInvalid = true;
    }

    if (!isFormDataInvalid) {
      this.thankYouPopUp();
    }
  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.requestForPodForm.reset();
    this.modalService.dismissAll();
    this.emailInputVal();
    this.nameInputVal();
    this.companyNameInputVal();
    this.accountNumberCheckInputVal();
  }

  thankYouPopUp() {
    this.subscription.add(this.orderService.requestForPod(this.requestForPodForm.value).subscribe(responseData => {
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
    return (!this.requestForPodForm.get('phone').valid && this.requestForPodForm.get('phone').touched);
  }

}
