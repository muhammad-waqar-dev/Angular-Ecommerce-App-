import { ViewChild } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { myTeamConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { AddNewMemberService } from 'src/app/core/service/addNewTeamMember.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import * as permissionsJSON from './permissions.json';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class MyTeamsAddTeamMemberComponent implements OnInit, OnDestroy {
  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  addMemberForm: UntypedFormGroup;
  myTeam = myTeamConstants;
  numpattern = new RegExp("^[0-9-+()-]");
  @ViewChild('addMemberFormModal', { static: true }) addMemberFormModal;
  isMobile: boolean = CommonUtils.isMobile();
  permissionsList = (permissionsJSON as any).default;
  popupThankYouMessage = popupThankYouMessage;
  emailCheck = false;
  nameCheck = false;
  selectedAccount: any;
  postAddNewMemberData: any;
  maxDate: any | null | NgbDate;
  minDate: any | null | NgbDate; 

  private subscription = new Subscription();
  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private addNewMemberService: AddNewMemberService, 
    private calendar: NgbCalendar,
    private accountDropDownStateService: AccountDropDownStateService) { }

  ngOnInit() {
    this.initializeForm();
    this.subscription.add(this.shareEvents.addTeamMemberSubjectReceiveEvent().subscribe(() => {
      this.openModal();
    }));
    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }


  emailCheckVal() {
    this.emailCheck = false;
  }
  nameCheckVal() {
    this.nameCheck = false;
  }
  
  openModal() {
    this.modalService
      .open(this.addMemberFormModal, { centered: true, windowClass: 'addMemberForm', size: 'lg' })
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


  initializeForm() {
    this.addMemberForm = this.fb.group(
      {
        name: new UntypedFormControl(null, [Validators.required]),
        email: new UntypedFormControl(null, [Validators.required, Validators.email]),
        phone: new UntypedFormControl(null, [Validators.minLength(6), Validators.maxLength(16)]),
        jobTitle: new UntypedFormControl(null),
        validFrom: new UntypedFormControl(null),
        validTo: new UntypedFormControl(null),
        fbQuotesGroup: new UntypedFormControl(false),
        fbOrdersDeliveriesGroup: new UntypedFormControl(false),
        fbProductsGroup: new UntypedFormControl(false),
        fbAddtoCartGroup: new UntypedFormControl(false),
        fbPricingGroup: new UntypedFormControl(false),
        fbAccountsGroup: new UntypedFormControl(false),
        fbManageMyTeamGroup: new UntypedFormControl(false),
        fbWhyFIGroup: new UntypedFormControl(false),
        all: new UntypedFormControl(false)

      }
    );
    this.minDate = {
      day:this.calendar.getToday().day,
      month: this.calendar.getToday().month,
      year: this.calendar.getToday().year,
    }
  }
  resetAndCloseForm() {
    this.emailCheck = false;
    this.nameCheck = false;
    this.responseOpen = true;
    this.addMemberForm.reset();
    this.modalService.dismissAll();
  }

  formValidationCheck() {

    if (this.isNullOrEmpty(this.addMemberForm.value.email) || this.isNullOrEmpty(this.addMemberForm.value.name)) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  submit($data) {

    var isFormValid: boolean = true;

    if (this.addMemberForm.controls.email.errors) {
      this.emailCheck = true;
      isFormValid = false;
    }
    if (this.addMemberForm.controls.phone.errors) {
      isFormValid = false;
    }
    if (this.addMemberForm.controls.name.errors) {
      this.nameCheck = true;
      isFormValid = false;
    }

    if (isFormValid) {
      this.postAddNewMemberRequest();
    } else {
    }
  }

  postAddNewMemberRequest() {
    this.subscription.add(this.addNewMemberService.addNewMember(JSON.stringify(this.getPostDataJSON())).subscribe((response) => {
      if (response === "Success") {
        this.responseSuccess = true;
      } else {
        this.responseSuccess = false;
      }
      this.responseOpen = false;
      this.unCheckAllPermissions();
    }, error => {
      this.responseSuccess = false;
      this.responseOpen = false;
      this.unCheckAllPermissions();
    }));
  }
  getPostDataJSON() {
    if ((sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {

      return this.postAddNewMemberData = {
        "type": "Update",
        "accountName": sessionStorage.getItem("fbCSRTradeAccName"),
        "accountNumber": sessionStorage.getItem("fbCSRTradeAcc"),
        "email": localStorage.getItem("emailID"),
        "name": this.accountDropDownStateService.userdisplayName,
        teamMemberName: this.addMemberForm.value.name,
        teamMemberEmail: this.addMemberForm.value.email,
        teamMemberPhoneNumber: this.addMemberForm.value.phone,
        teamMemberJobTitle: this.addMemberForm.value.jobTitle,
        teamMemberPermissionList: this.getPermissionListNames(),
        'teamMemberValidFrom': this.addMemberForm.value.validFrom ? this.convertDate(this.addMemberForm.value.validFrom) : null,
        'teamMemberValidTo': this.addMemberForm.value.validTo ? this.convertDate(this.addMemberForm.value.validTo) : null
      };
    }
    else {
    return this.postAddNewMemberData = {
      "type": "Add",
      "accountName": this.selectedAccount.name,
      "accountNumber": this.selectedAccount.uid,
      "email": this.accountDropDownStateService.getAccountEmailId,
      "name": this.accountDropDownStateService.userdisplayName,
      teamMemberName: this.addMemberForm.value.name,
      teamMemberEmail: this.addMemberForm.value.email,
      teamMemberPhoneNumber: this.addMemberForm.value.phone,
      teamMemberJobTitle: this.addMemberForm.value.jobTitle,
      teamMemberPermissionList: this.getPermissionListNames(),
      'teamMemberValidFrom': this.addMemberForm.value.validFrom ? this.convertDate(this.addMemberForm.value.validFrom) : null,
      'teamMemberValidTo': this.addMemberForm.value.validTo ? this.convertDate(this.addMemberForm.value.validTo) : null
    };
  }
  }

  getPermissionListNames() {
    var permissions = [];
    this.permissionsList.permissions.forEach(permission => {
      if (permission.selected) {
        permissions.push(permission.code);
      }
    });
    return permissions;
  }

  permissionToggled(code: string, index: number, event) {
    if (code !== "all") {
      this.permissionsList.permissions[index].selected = !this.permissionsList.permissions[index].selected;
    }
    if (code === "all" && event.target.checked == true) {
      this.permissionsList.permissions.forEach(permission => {
        permission.selected = true;
      });
    } else if (code === "all" && event.target.checked == false) {
      this.permissionsList.permissions.forEach(permission => {
        permission.selected = false;
      });
    }

    let updatedStatus;
    if(event.target.checked == true) {
      updatedStatus = 'ON'
    } else {
      updatedStatus = 'OFF'
    }
    this.subscription.add(this.addNewMemberService.updateTeamMember(updatedStatus, code).subscribe(data => {
      if(data.permissions.length > 0) {
        for(let i = 0; i < this.permissionsList.permissions.length; i++) {
          for(let j = 0; j < data.permissions.length; j++) {
              if(this.permissionsList.permissions[i].code == data.permissions[j].code) {
                this.permissionsList.permissions[i].selected = data.permissions[j].selected;
              }
          }
         }
      }
    }));
  }

  allowAllPermissions() {

  }

  convertDate(date: any) {
    return date.day + '/' + date.month + '/' + date.year;
  }

  unCheckAllPermissions() {
    this.permissionsList.permissions.forEach(permission => {
      permission.selected = false;
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

  ngOnDestroy() {
    this.resetAndCloseForm();
    this.subscription.unsubscribe();
  }
}
