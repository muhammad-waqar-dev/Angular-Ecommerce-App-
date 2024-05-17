import { Component, OnDestroy, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { AddNewMemberService } from 'src/app/core/service/addNewTeamMember.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { popupThankYouMessage } from 'src/app/core/constants/general';

@Component({
  selector: 'app-remove-team-member',
  templateUrl: './remove-team-member.component.html',
  styleUrls: ['./remove-team-member.component.scss']
})
export class RemoveTeamMemberComponent implements OnInit, OnDestroy {

  @Output() removeMember: EventEmitter<any> = new EventEmitter();
  @Input() user: any;
  @ViewChild('removeMemberFormModal', { static: true }) removeMemberFormModal;
  isMobile: boolean = CommonUtils.isMobile();
  selectedAccount: any;
  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  postAddNewMemberData: any;
  popupThankYouMessage = popupThankYouMessage;
  private subscription = new Subscription();
  constructor(private modalService: NgbModal,
    private shareEvents: ShareEvents,
    private addNewMemberService: AddNewMemberService,
    private accountDropDownStateService: AccountDropDownStateService) { }

  ngOnInit() {
    this.subscription.add(this.shareEvents.removeTeamMemberSubjectReceiveEvent().subscribe(() => {
      this.openModal();
    }));
    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openModal() {
    this.modalService
      .open(this.removeMemberFormModal, { centered: true, windowClass: 'addMemberForm', size: 'lg' })
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

  resetAndCloseForm() {
    this.modalService.dismissAll();
  }

  removeTeamMemberConfirmed() {
    this.removeMember.emit();
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
        teamMemberName: this.user.name,
        teamMemberEmail: this.user.email,
        teamMemberPhoneNumber: this.user.phoneNumber,
        teamMemberJobTitle: this.user.jobTitle,
        "teamMemberPermissionList": [],
        "teamMemberValidFrom": "",
        "teamMemberValidTo": ""
      };
    }
    else {
    return this.postAddNewMemberData = {
      "type": "Remove",
      "accountName": this.selectedAccount.name,
      "accountNumber": this.selectedAccount.uid,
      "email": this.accountDropDownStateService.getAccountEmailId,
      "name": this.accountDropDownStateService.userdisplayName,
      teamMemberName: this.user.name,
      teamMemberEmail: this.user.email,
      teamMemberPhoneNumber: this.user.phoneNumber,
      teamMemberJobTitle: this.user.jobTitle,
      "teamMemberPermissionList": [],
      "teamMemberValidFrom": "",
      "teamMemberValidTo": ""
    };
  }
  }
}
