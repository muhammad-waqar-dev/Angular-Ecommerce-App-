import { Input, ViewChild } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { myTeamConstants, popupThankYouMessage } from 'src/app/core/constants/general';
import { AddNewMemberService } from 'src/app/core/service/addNewTeamMember.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import * as permissionsJSON from './permissions.json';

@Component({
  selector: 'app-update-team-member',
  templateUrl: './update-team-member.component.html',
  styleUrls: ['./update-team-member.component.scss']
})
export class MyTeamsUpdateTeamMemberComponent implements OnInit, OnDestroy {

  @Input() user;
  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  addMemberForm: UntypedFormGroup;
  myTeam = myTeamConstants;
  numpattern = '[0-9]*$';
  userPermissions$ = new BehaviorSubject<any>('');
  previousSelectedPermission: any;
  latestPermissions: any;
  @ViewChild('updateMemberFormModal', { static: true }) updateMemberFormModal;
  isMobile: boolean = CommonUtils.isMobile();
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
    this.subscription.add(this.shareEvents.updateTeamMemberSubjectReceiveEvent().subscribe((data) => {
      this.user = data;
      this.userPermissions$.next(data.modulePermissions);
      this.previousSelectedPermission =data.modulePermissions;
      this.updateMemberForm(data);
      this.openUpdateModal();
    }));
    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }

  updateMemberForm(formData) {
    this.addMemberForm.controls.name.setValue(formData?.name);
    this.addMemberForm.controls.email.setValue(formData?.email);
    this.addMemberForm.controls.phone.setValue(formData?.phoneNumber);
    this.addMemberForm.controls.jobTitle.setValue(formData?.jobTitle);
    this.addMemberForm.controls.validFrom.setValue('21-03-2021');
    this.addMemberForm.controls.validTo.setValue('21-04-2022');
  }

  emailCheckVal() {
    this.emailCheck = false;
  }
  nameCheckVal() {
    this.nameCheck = false;
  }
  
  openUpdateModal() {
    this.modalService
      .open(this.updateMemberFormModal, { centered: true, windowClass: 'addMemberForm', size: 'lg' })
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
        name: new UntypedFormControl({value: this.user?.name, disabled: true}, [Validators.required]),
        email: new UntypedFormControl({value: this.user?.uid, disabled: true}, [Validators.required, Validators.email]),
        phone: new UntypedFormControl({value: this.user?.phoneNumber, disabled: true},),
        jobTitle: new UntypedFormControl({value: this.user?.jobTitle, disabled: true}),
        validFrom: new UntypedFormControl({value: ''}),
        validTo: new UntypedFormControl({value: ''})
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
    }, error => {
      this.responseSuccess = false;
      this.responseOpen = false;
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
        teamMemberName: this.user?.name,
        teamMemberEmail: this.user?.uid,
        teamMemberPhoneNumber: this.user?.phoneNumber,
        teamMemberJobTitle: this.user?.jobTitle,
        teamMemberPermissionList: this.getPermissionListNames(),
        'teamMemberValidFrom': this.addMemberForm.value.validFrom ? this.convertDate(this.addMemberForm.value.validFrom) : null,
        'teamMemberValidTo': this.addMemberForm.value.validTo ? this.convertDate(this.addMemberForm.value.validTo) : null
      };
    }
    else {
    return this.postAddNewMemberData = {
      "type": "Update",
      "accountName": this.selectedAccount?.name,
      "accountNumber": this.selectedAccount?.uid,
      "email": localStorage.getItem("emailID"),
      "name": this.accountDropDownStateService.userdisplayName,
      teamMemberName: this.user?.name,
      teamMemberEmail: this.user?.uid,
      teamMemberPhoneNumber: this.user?.phoneNumber,
      teamMemberJobTitle: this.user?.jobTitle,
      teamMemberPermissionList: this.getPermissionListNames(),
      'teamMemberValidFrom': this.addMemberForm.value.validFrom ? this.convertDate(this.addMemberForm.value.validFrom) : null,
      'teamMemberValidTo': this.addMemberForm.value.validTo ? this.convertDate(this.addMemberForm.value.validTo) : null
    };
    }
  }

  getPermissionListNames() {
    var permissions = [];
    this.previousSelectedPermission.forEach(permission => {
      if (permission.selected == true) {
        permissions.push(permission.code);
      }
    });
    return permissions;
  }

  convertDate(date: any) {
    return date.day + '/' + date.month + '/' + date.year;
  }

  changePermissionStatus(event, permissionId) {
    let updatedStatus;
    if(event.target.checked == true) {
      updatedStatus = 'ON'
    } else {
      updatedStatus = 'OFF'
    }
    
    this.subscription.add(this.addNewMemberService.updateTeamMember(updatedStatus, permissionId).subscribe(data => {
      if(data.permissions.length > 0) {
       this.latestPermissions = data.permissions;
       for(let i = 0; i < this.previousSelectedPermission.length; i++) {
        for(let j = 0; j < this.latestPermissions.length; j++) {
            if(this.previousSelectedPermission[i].code == this.latestPermissions[j].code) {
              this.previousSelectedPermission[i].selected = this.latestPermissions[j].selected;
            }
        }
       }
       for(let k = 0; k < this.previousSelectedPermission.length; k++) {
        if(this.previousSelectedPermission[k].code == permissionId) {
          this.previousSelectedPermission[k].selected = event.target.checked;
        }
      }
      } else {
        for(let k = 0; k < this.previousSelectedPermission.length; k++) {
          if(this.previousSelectedPermission[k].code == permissionId) {
            this.previousSelectedPermission[k].selected = event.target.checked;
          }
        }
      }
      
    }));
  }

  ngOnDestroy() {
    this.resetAndCloseForm();
    this.subscription.unsubscribe();
  }
}
