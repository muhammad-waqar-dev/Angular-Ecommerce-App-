import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CmsService } from '@spartacus/core';
import { createAccountFormConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';
import { CreateAccountsService } from 'src/app/shared/services/create-accounts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { popupThankYouMessage } from 'src/app/core/constants/general';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  popupThankYouMessage = popupThankYouMessage;
  createAccountForm: UntypedFormGroup;
  subFormDisplayType: string = 'display';
  bgImage: any;
  numpattern = '^[0-9]*$';
  postalCodeNumPattern = /^\d{4}$/;
  isMobile: boolean = false;

  // Booleans for Form Validation
  createAccountFormConstants = createAccountFormConstants;
  @ViewChild('createAccountSuccessModal', { static: true }) createAccountSuccessModal;

  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNoCheck: boolean = false;
  dropDownCheck: boolean = false;
  postalCodeCheck: boolean = false;
  zipCodeCheck: boolean = false;
  stateCheck: boolean = false;
  suburbCheck: boolean = false;
  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  private subscription = new Subscription();


  constructor(private fb: UntypedFormBuilder, private cmsService: CmsService, private createAccountService: CreateAccountsService, private modalService: NgbModal,
    private shareEvents: ShareEvents, private router: Router) {
    this.createAccountForm = this.fb.group({
      emailAddress: new UntypedFormControl(null, [Validators.required, Validators.email]),
      customerName: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
      phoneNumber: new UntypedFormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
      fiAccountDropdown: new UntypedFormControl(),
      accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
      companyName: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
      companyAddress: new UntypedFormControl(),
      postalCode: new UntypedFormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      state: new UntypedFormControl(null, [Validators.required]),
      suburb: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
      companyDescription: new UntypedFormControl()
    });
  }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'Create Account Page', // enter if exists
    'pageType': 'Create Account Page',
    'isLoggedIn': 'Yes'
    });
    this.cmsService.getComponentData("FICreateAccountBannerComponent").subscribe((data) => {
      this.bgImage = data;
    })
    this.getScreenSize();
    this.isMobile = CommonUtils.isMobile();
    this.subscription.add(this.shareEvents.createAccountSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

  }

  getScreenSize() {
    const browserZoomLevel = window.devicePixelRatio;
    if (browserZoomLevel > 1) {
      document.querySelector('body').classList.add('appScaleLevel');
    }
  }

  submit() {

    if (this.isNullOrEmpty(this.createAccountForm.value.emailAddress)) {
      this.emailCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.accountNumber)) {
      this.accountNoCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.CustomerName)) {
      this.nameCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.companyName)) {
      this.companyNameCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.postalCode)) {
      this.postalCodeCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.state)) {
      this.stateCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.suburb)) {
      this.suburbCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.fiAccountDropdown)) {
      this.dropDownCheck = true;
    }

    if(!this.emailCheck && !this.nameCheck && !this.dropDownCheck &&
      ((this.createAccountForm.value.fiAccountDropdown === 'Yes' && !this.accountNoCheck && !this.companyNameCheck) ||
        (this.createAccountForm.value.fiAccountDropdown === 'No' && !this.companyNameCheck && !this.suburbCheck && !this.stateCheck && !this.postalCodeCheck && this.createAccountForm.controls.postalCode.valid) )
      ){
      let companyAddress;
      if(this.createAccountForm.value.accountNumber.length < 1){
        this.createAccountForm.value.accountNumber = null;
      }
      if(this.createAccountForm.value.fiAccountDropdown === 'Yes'){
        companyAddress = null;
      }
      else{
        companyAddress = {
          "city": this.createAccountForm.value.suburb,
          "postCode": this.createAccountForm.value.postalCode,
          "region": this.createAccountForm.value.state,
          "streetHouseNo": this.createAccountForm.value.companyAddress
          }
      }


      let formData = {
        "email": this.createAccountForm.value.emailAddress,
        "name": this.createAccountForm.value.CustomerName,
        "accountNumber": this.createAccountForm.value.accountNumber,
        "accountName": this.createAccountForm.value.companyName,
        "companyAddress": companyAddress,
        "phoneNumber": this.createAccountForm.value.phoneNumber,
        "isCustomerAccountExist": this.createAccountForm.value.fiAccountDropdown,
        "additionalInfo":this.createAccountForm.value.companyDescription
      }

      this.createAccountService.createAccount(formData).subscribe(data => {

        this.responseOpen = false;
        this.responseSuccess = true;
        this.shareEvents.createAccountSubjectSendEvent();
        this.resetPage();
      })
    }
    else{
    }
  }

  // Method to Check if Form's Required Fields are Valid or Not
  formValidationCheck() {

    // Check if Customer has FI Account
    if (this.createAccountForm.value.fiAccountDropdown === "Yes") {
      if (this.getCommonFieldsValidation()) {
        return true;
      } else {
        return false
      }
    } else if (this.createAccountForm.value.fiAccountDropdown === "No") {
      if (this.getCommonFieldsValidation()
        || this.isNullOrEmpty(this.createAccountForm.value.postalCode)
        || this.isNullOrEmpty(this.createAccountForm.value.state)
        || this.isNullOrEmpty(this.createAccountForm.value.suburb)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }


  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.createAccountForm.value.emailAddress) ||
      this.isNullOrEmpty(this.createAccountForm.value.CustomerName) || this.isNullOrEmpty(this.createAccountForm.value.companyName))
  }


  // Input Field Focus changes

  emailInputVal() {
    this.emailCheck = false;
  }

  nameInputVal() {
    this.nameCheck = false;
  }

  accountNoInputVal() {
    this.accountNoCheck = false;
  }
  companyNameInputVal() {
    this.companyNameCheck = false;
  }

  postalCodeInputVal() {
    this.postalCodeCheck = false;
  }

  zipCodeInputVal() {
    this.zipCodeCheck = false;
  }

  stateInputVal() {
    this.stateCheck = false;
  }

  suburbInputVal() {
    this.suburbCheck = false;
  }

  dropDownCheckSelectVal() {
    this.dropDownCheck = false;
  }

  validatePhoneNum() {
    return (!this.createAccountForm.get('phoneNumber').valid && this.createAccountForm.get('phoneNumber').touched);
  }
  openPopup() {
    this.modalService
      .open(this.createAccountSuccessModal, { centered: true, windowClass: 'createAccountForm', size: 'lg' })
      .result.then(
        (result) => {
          this.resetAndCloseForm();
          window.location.href = '/login';
        },
        (reason) => {
          this.resetAndCloseForm();
          setTimeout(() => {
            window.scroll(0, 0);
          }, 100);
           window.location.href = '/login';
        }
      );
  }
  resetAndCloseForm() {
    this.responseOpen = true;
    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.resetAndCloseForm();
  }

  resetPage(){
    this.createAccountForm = this.fb.group({
      emailAddress: new UntypedFormControl(null, [Validators.required, Validators.email]),
      customerName: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
      phoneNumber: new UntypedFormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
      fiAccountDropdown: new UntypedFormControl(),
      accountNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
      companyName: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
      companyAddress: new UntypedFormControl(),
      postalCode: new UntypedFormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      state: new UntypedFormControl(null, [Validators.required]),
      suburb: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
      companyDescription: new UntypedFormControl()
    });
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
