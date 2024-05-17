import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ContentPageMetaResolver } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { createwhyfiConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { WhyfiworkCatalystService } from 'src/app/core/service/whyfiworkcatalyst.service';


@Component({
  selector: 'app-work-with-fi',
  templateUrl: './work-with-fi.component.html',
  styleUrls: ['./work-with-fi.component.scss']
})
export class WorkWithFiComponent implements OnInit {

  workWithFIForm: UntypedFormGroup;
  isMobile: boolean = false;
  formName: string = '';
  createwhyfiConstants = createwhyfiConstants;
  private subscription = new Subscription();
  popupThankYouMessage = popupThankYouMessage;
  isLoading$ = new BehaviorSubject<boolean>(true);
  @Output() valueChange = new EventEmitter();
  permissionAllowed: boolean;
  newContact: string = 'No';
  catalystContact: string = 'No';
  selectedAccount: any;

  constructor(private fb: UntypedFormBuilder,
    private contentPageMetaResolver: ContentPageMetaResolver,
    private modalService: NgbModal,
    private userDetails: AccountDropDownStateService,
    private permissionUtil: PermissionService,
    private whyfiworkCatalystService: WhyfiworkCatalystService,
    private shareEvents: ShareEvents) {
      this.applyBreadcrumbs();
    this.initializeFormGroup();
  }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'Working with FI', // enter if exists
    'pageType': 'Working with FI',
    'isLoggedIn': 'Yes'
    });
    this.getScreenSize();
    this.isMobile = CommonUtils.isMobile();

    // If Data Load is Still In Progress
    if (this.userDetails._getAccountState$ && this.userDetails.isDataAvailable) {
      this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbWhyFIGroup") || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
      if (!this.permissionAllowed) {
        (document.querySelector(".BottomHeaderSlot") as HTMLElement).style.display = 'none';
      }
      this.isLoading$.next(false);
      this.valueChange.emit(true);
    } else {
      // Register the Receive Event and do the Needful
      this.shareEvents.accountsInfoAvailableSubjectReceiveEvent().subscribe(() => {
        this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbWhyFIGroup") || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
        if (!this.permissionAllowed) {
          (document.querySelector(".BottomHeaderSlot") as HTMLElement).style.display = 'none';
        }
        this.isLoading$.next(false);
        this.valueChange.emit(true);
      });
    }

    this.subscription.add(this.userDetails._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));

  }

  getScreenSize() {
    const browserZoomLevel = window.devicePixelRatio;
    if (browserZoomLevel > 1) {
      document.querySelector('body').classList.add('appScaleLevel');
    }
  }

  submit(content) {
    let catalystForm
    if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
     catalystForm = {
      "accountNumber": this.selectedAccount.uid,
      "companyName": this.selectedAccount.name,
      "description": "",
      "email": this.userDetails.getAccountEmailId,
      "like2Contact": "",
      "market": "",
      "name": this.userDetails.userdisplayName,
      "phone": this.userDetails.getAccountPhoneNum,
      "suggestionType": ""
    }
    }
    else {
       catalystForm = {
        "accountNumber": sessionStorage.getItem("fbCSRTradeAcc"),
        "companyName": sessionStorage.getItem("fbCSRTradeAccName"),
        "description": "",
        "email": localStorage.getItem("emailID"),
        "like2Contact": "",
        "market": "",
        "name": this.userDetails.userdisplayName,
        "phone": this.userDetails.getAccountPhoneNum,
        "suggestionType": ""
      }
    }
    if (this.formName === "ideaForm" && this.formValidationCheckIdea()) {
      if(this.workWithFIForm.controls['serviceIdeaCheckbox'].value == true) {
        this.newContact = "Yes";
        } else {
          this.newContact = "No";
      }
      catalystForm.suggestionType = "New";
      catalystForm.like2Contact = this.newContact;
      catalystForm.description = this.workWithFIForm.controls['briefDesc'].value;
      catalystForm.market = this.workWithFIForm.controls['prodServiceIdea'].value;
      this.whyfiworkCatalystService.sendWorkCatalyst(catalystForm).subscribe((data) => {
        this.resetIdeaForm();
        this.showSuccessMessage(1, content)
      })

    }
    else if (this.formName === "catalystForm" && this.formValidationCheckCatalyst()) {
      if(this.workWithFIForm.controls['catalystCheckbox'].value == true) {
        this.catalystContact = "Yes";
        } else {
          this.catalystContact = "No";
      }
      catalystForm.suggestionType = "Change";
      catalystForm.like2Contact = this.catalystContact;
      catalystForm.description = this.workWithFIForm.controls['catalystForChange'].value;
      this.whyfiworkCatalystService.sendWorkCatalyst(catalystForm).subscribe((data) => {
      this.resetCatalystForm();
      this.showSuccessMessage(2, content)
      })
    }
  }

  catalystSubmit() {
    this.formName = 'catalystForm'
  }

  ideaSubmit() {
    this.formName = 'ideaForm'
  }

  resetIdeaForm() {
    this.workWithFIForm.controls['prodServiceIdea'].setValue('Market');
    this.workWithFIForm.controls['briefDesc'].setValue(null);
    this.workWithFIForm.controls['serviceIdeaCheckbox'].setValue(false);
  }
  resetCatalystForm() {
    this.workWithFIForm.controls['catalystForChange'].setValue(null);
    this.workWithFIForm.controls['catalystCheckbox'].setValue(false);
  }
  briefInputVal() {
    this.workWithFIForm.value.briefDesc
  }

  formValidationCheckIdea() {
    if (this.workWithFIForm.value.briefDesc?.length > 0) {
      return true;
    }
    else {
      return false;
    }

  }
  formValidationCheckCatalyst() {
    if (this.workWithFIForm.value.catalystForChange?.length > 0) {
      return true;
    }
    else {
      return false;
    }

  }

  prodServiceInputVal() {

  }

  showSuccessMessage(id, content) {
    this.modalService.open(content, { centered: true, size: 'lg', windowClass: 'contactCSRForm', ariaLabelledBy: 'modal-basic-title' });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  closePopup() {
    this.modalService.dismissAll();
  }

  initializeFormGroup() {
    this.workWithFIForm = this.fb.group({
      prodServiceIdea: new UntypedFormControl(0),
      briefDesc: new UntypedFormControl(null),
      serviceIdeaCheckbox: new UntypedFormControl(false),

      catalystForChange: new UntypedFormControl(null),
      catalystCheckbox: new UntypedFormControl(false),

    });
  }
  applyBreadcrumbs() {
    this.subscription.add(this.contentPageMetaResolver.resolveBreadcrumbs().subscribe((data) => {
      data.push(
        { label: createwhyfiConstants.whyfi_Label, link: createwhyfiConstants.whyfi_Link },
        { label: createwhyfiConstants.whyfi_working_with_fi_Label, link: createwhyfiConstants.whyfi_working_with_fi_Link }
      )
    }));
  }
}
