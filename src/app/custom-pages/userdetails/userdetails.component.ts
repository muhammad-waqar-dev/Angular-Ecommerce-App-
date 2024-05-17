import { Component, OnInit, ViewChild } from '@angular/core';
import { popupThankYouMessage, userDetailFormConstants, userDetailsConstants } from 'src/app/core/constants/general';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonUtils } from 'src/app/core/utils/utils';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { UserProfileDetailsService } from 'src/app/core/service/userprofileDetails.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ContentPageMetaResolver } from '@spartacus/core';
import { PermissionService } from 'src/app/core/service/permissions.services';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {
  createUserDetailForm: UntypedFormGroup;
  private subscription = new Subscription();

  numpattern = '^[0-9]*$';
  postalCodeNumPattern = /^\d{4}$/;
  isMobile: boolean = false;
  responseOpen: boolean = true;
  userDetailsConstants = userDetailsConstants;
  userDetailFormConstants = userDetailFormConstants;
  popupThankYouMessage = popupThankYouMessage;
  ABNCheck: boolean = false;
  accountNoCheck: boolean = false;
  companyNameCheck: boolean = false;
  dropDownCheck: boolean = false;
  postalCodeCheck: boolean = false;

  postalPhoneCheck: boolean = false;
  postalMobileCheck: boolean = false;
  postalFaxCheck: boolean = false;

  zipCodeCheck: boolean = false;
  stateCheck: boolean = false;
  emailCheck: boolean = false;
  nameCheck: boolean = false;
  indAcInfEmailCheck: boolean = false;
  indAcInfPhoneCheck: boolean = false;

  permissionAllowed: boolean;

  indAcInfSalutation: boolean = false;
  closeResult = '';
  accountsData: any;
  selectedAccount: any;
  accountState: any;
  selectedAccountFIRepInfo: any;
  selectedAccountBillingAddressInfo: any;
  responseSuccess: boolean = false;
  userPhoneNum: any;
  firstNameDetail: any;
  lastNameDetail: any;
  @ViewChild('content', { static: true }) content

  contactPref: string = '';

  constructor(private fb: UntypedFormBuilder, private router: Router, private modalService: NgbModal,
    private accountDropDownStateService: AccountDropDownStateService,
    private userProfileDetailsService: UserProfileDetailsService, private contentPageMetaResolver: ContentPageMetaResolver,
    private permissionUtil: PermissionService) {

    this.accountDropDownStateService._getAccountState$.subscribe((accountState) => {
      this.accountState = accountState?.accountData;
      
      if ((sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
        console.log('accountState - internalStaff >>>>>>>>>>>>', this.accountState);

        this.selectedAccount = JSON.parse(sessionStorage.getItem("validateResponse"));
        // this.selectedAccount = this.accountState;
        this.selectedAccountFIRepInfo = this.selectedAccount?.salesPerson;
        this.selectedAccountBillingAddressInfo = this.selectedAccount?.companyAddress;
        this.initializeForm();
        this.applyBreadcrumbs();
      }
    });

    this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
        this.selectedAccount = selAccount.selectedAccount;
        this.selectedAccountFIRepInfo = this.selectedAccount?.salesPerson;
        this.selectedAccountBillingAddressInfo = this.selectedAccount?.companyAddress;
        this.initializeForm();
        this.applyBreadcrumbs();
      }
    });
  }

  initializeForm() {
    let jobTitle = '';
    let poBox = '';
    if(this.selectedAccountBillingAddressInfo?.poBox !== 'undefined'){
      poBox = this.selectedAccountBillingAddressInfo?.poBox
    }

    if(this.accountDropDownStateService.getAccountPhoneNum !== 'undefined') {
      this.userPhoneNum = this.accountDropDownStateService?.getAccountPhoneNum;
    }
    else {
      this.userPhoneNum = '';
    }

    if(this.accountDropDownStateService.getjobTitle !== 'undefined'){
      jobTitle = this.accountDropDownStateService.getjobTitle;
    }

   

    if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
      this.firstNameDetail = this.accountState?.firstName;
      this.lastNameDetail = this.accountState?.lastName;
    }
    else {
      this.firstNameDetail = localStorage.getItem("firstname");
      this.lastNameDetail = localStorage.getItem("lastname");
    }

    this.createUserDetailForm = this.fb.group({
      ABN: new UntypedFormControl(null),
      accountNumber: new UntypedFormControl(this.selectedAccount?.uid),
      companyName: new UntypedFormControl(this.selectedAccount?.name,),
      emailAddress: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.email, [Validators.required, Validators.email]),
      firstName: new UntypedFormControl(this.firstNameDetail),
      lastName: new UntypedFormControl(this.lastNameDetail),

      street: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.line1),
      city: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.town),
      postalCode: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.postalCode, [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      region: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.region?.name),
      country: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.country?.name),

      postalPOBox: new UntypedFormControl(poBox, [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      postalCity: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.town),
      postalPostCode: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.postalCode, [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      postalRegion: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.region?.name),
      postalCountry: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.country?.name),
      postalPhone: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.phone, [Validators.minLength(6), Validators.maxLength(16)]),
      postalMobile: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.cellphone, [Validators.minLength(6), Validators.maxLength(16)]),
      postalFax: new UntypedFormControl(this.selectedAccountBillingAddressInfo?.fax, [Validators.minLength(6), Validators.maxLength(16)]),

      salesRepName: new UntypedFormControl(this.selectedAccountFIRepInfo?.name),
      salesRepPhone: new UntypedFormControl(this.selectedAccountFIRepInfo?.phone, [Validators.minLength(6), Validators.maxLength(16)]),
      salesRepEmail: new UntypedFormControl(this.selectedAccountFIRepInfo?.email, [Validators.email]),
      indAcInfSalutation: new UntypedFormControl(this.accountState?.title?.split('.').join("")),
      indAcInfEmail: new UntypedFormControl(this.accountDropDownStateService?.getAccountEmailId, [Validators.required, Validators.email]),
      indAcInfPhone: new UntypedFormControl(this.userPhoneNum, [Validators.minLength(6), Validators.maxLength(16)]),
      indAcInfJobTitle: new UntypedFormControl(jobTitle),
    });
  }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'User Profile', // enter if exists
    'pageType': 'User Profile',
    'isLoggedIn': 'Yes'
    });
    this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbManageMyTeamGroup");
    this.getScreenSize();
    this.isMobile = CommonUtils.isMobile();
  }

  getScreenSize() {
    const browserZoomLevel = window.devicePixelRatio;
    if (browserZoomLevel > 1) {
      document.querySelector('body').classList.add('appScaleLevel');
    }
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

  salutationInputVal() {
    this.indAcInfSalutation = false;
  }
  accountNoInputVal() {

  }
  postalCodeInputVal() {
    this.postalCodeCheck = false;
  }

  submitCompanyAddress() {
  }
  submitPostalAddress() {
    if ((!this.isNullOrEmpty(this.createUserDetailForm.value.emailAddress) || this.createUserDetailForm.get('emailAddress').valid) 
    && this.createUserDetailForm.get('postalPhone').valid
    && this.createUserDetailForm.get('postalMobile').valid
    && this.createUserDetailForm.get('postalFax').valid) {
      !this.userProfileDetailsService.sendUserProfileDetails(JSON.stringify(this.getAddressData())).subscribe((responseData) => {
        this.parseAPIResponse(responseData);
      }, error => {
        this.responseSuccess = false;
        this.openStatusPopup();
      });
    } else {
      if(!this.createUserDetailForm.get('emailAddress').valid){this.emailCheck = true;}
      if(!this.createUserDetailForm.get('postalPhone').valid){this.postalPhoneCheck = true;}
      if(!this.createUserDetailForm.get('postalMobile').valid){this.postalMobileCheck = true;}
      if(!this.createUserDetailForm.get('postalFax').valid){this.postalFaxCheck = true;}
    }
  }
  submitIndAccInfo() {
    if (!this.isNullOrEmpty(this.createUserDetailForm.value.indAcInfEmail) && this.createUserDetailForm.get('indAcInfEmail').valid) {
      this.userProfileDetailsService.sendUserProfileDetails(JSON.stringify(this.getMyDetailsJSON())).subscribe((responseData) => {
        this.parseAPIResponse(responseData);
      }, error => {
        this.responseSuccess = false;
        this.openStatusPopup();
      });
    } else {

      
      
      if(!this.createUserDetailForm.get('indAcInfEmail').valid){this.indAcInfEmailCheck = true;}
      if(!this.createUserDetailForm.get('indAcInfPhone').valid){this.indAcInfPhoneCheck = true;}
      
    }
  }

  showSuccessMessage() {
    setTimeout(function () {
      document.getElementById('success-msg').style.display = 'none';
    }, 3000);
  }
  parseAPIResponse(responseData) {
    if (responseData === "Success") {
      this.responseSuccess = true;
    } else {
      this.responseSuccess = false;
    }
    this.openStatusPopup();
  }
  openStatusPopup() {
    this.modalService.open(this.content, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title', windowClass:'userDetailsModal' });
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }
  formAddressValidation() {
    if (this.isNullOrEmpty(this.createUserDetailForm.value.emailAddress)) { //|| this.isNullOrEmpty(this.createUserDetailForm.value.indAcInfEmail)
      return true;
    } else {
      return false;
    }
  }
  formMyDetailsValidation() {
    if (this.isNullOrEmpty(this.createUserDetailForm.value.indAcInfEmail)) {
      return true;
    } else {
      return false;
    }
  }
  validatePostalPhoneNum() {
    return (!this.createUserDetailForm.get('postalPhone').valid && this.createUserDetailForm.get('postalPhone').touched);
  }

  getValueForFieldDataSubmission(fieldValue: any) {
    return !this.isNullOrEmpty(fieldValue) ? fieldValue : "";
  }

  getMyDetailsJSON() {
    return {
      "myDetails": {
        "title": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.indAcInfSalutation),
        "email": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.indAcInfEmail),
        "phone": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.indAcInfPhone),
        "jobTitle": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.indAcInfJobTitle),
        "firstName": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.firstName),
        "lastName": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.lastName),
        "contactPreference": this.contactPref
      }
    }
  }

  getAddressData() {
    return {
      "companyAddress": {
        "streetHouseNo": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.street),
        "city": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.city),
        "postCode": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalCode),
        "region": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.region),
        "country": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.country),
        "email": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.emailAddress)

      },
      "companyPostalAddress": {
        "poBox": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalPOBox),
        "city": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalCity),
        "postCode": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalPostCode),
        "region": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalRegion),
        "country": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalCountry),
        "phone": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalPhone),
        "mobile": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalMobile),
        "fax": this.getValueForFieldDataSubmission(this.createUserDetailForm.value.postalFax)
      }
    }
  }

  indAcInfEmailChange() {
    this.indAcInfEmailCheck = false;
  }

  applyBreadcrumbs() {
    this.subscription.add(this.contentPageMetaResolver.resolveBreadcrumbs().subscribe((data) => {      
      data.push(
        { label: userDetailsConstants.userDetailsLabel, link: userDetailsConstants.userDetailsLink }
      )
    }));
  }
  validateChar(event) {
    var regex = new RegExp("^[0-9-+()-]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onContactPrefChange(event) {
    let value = event.target.value;
    this.contactPref = value;
  }
}
