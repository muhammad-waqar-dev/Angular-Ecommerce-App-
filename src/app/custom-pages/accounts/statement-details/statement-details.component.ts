import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { accountConstants, genericConstants, homeConstants } from 'src/app/core/constants/general';
import { AccountsService } from 'src/app/shared/services/accounts.service';

@Component({
  selector: 'app-statements-details',
  templateUrl: './statement-details.component.html',
  styleUrls: ['./statement-details.component.scss']
})
export class StatementDetailsComponent implements OnInit {

  @Input('data') data: any;
  @Input() creditLimit;
  @Output() navigateAccount: EventEmitter<any> = new EventEmitter();

  account: any = {};
  isLoading$ = new BehaviorSubject<boolean>(false);
  isMobile = CommonUtils.isMobile();

  accountConstants = accountConstants;
  genericConstants = genericConstants;
  homeConstants = homeConstants;

  isStatementGen: boolean = false;
  statementGenRes: any = '';

  blob: any = '';
  disableIcon = false;

  constructor(
    private shareEvents: ShareEvents,
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {

    this.account = this.data;

    window.scroll(0, 0);

    this.onStatementGen();
  }

  ngOnChanges() {
  }

  navigateToOrder() {
    this.navigateAccount.emit();

    // setting boolean state in centralized method - either account details page boolean is true/false
    this.shareEvents.setIsAccountDetails(false);
  }

  onStatementGen() {
    const stmtDate = this.account?.StatementDate || this.account?.journalEntryDate?.value;
    if (stmtDate) {
      let splitDate: any = stmtDate;
      if (this.account?.journalEntryDate?.value) {
        const dt = new Date(this.account?.journalEntryDate?.value);
        splitDate = this.account?.journalEntryDate?.value ? (dt.getDate() + '-' + this.getMonth(dt.getMonth() + 1) + '-' + dt.getFullYear()) : this.data.StatementDate.split(' ').join('-')
      } else {
        splitDate = splitDate?.split(" ")?.join('-')
      }


      this.accountsService.downloadPDF('STATEMENT', splitDate).subscribe((res: any) => {
        this.blob = new Blob([res], { type: 'application/pdf' });
        this.disableIcon = this.blob.size == 0 ? true : false;
        var downloadURL = window.URL.createObjectURL(res);
        this.statementGenRes = downloadURL;
        this.isStatementGen = true;
      });
    }
  }

  onOpenStatement() {
    window.open(this.statementGenRes, '_blank')
  }

  formateDate(date) {
    let getDate = date.split('-');
    return getDate[2] + ' ' + this.getMonth(getDate[1]) + ' ' + getDate[0];
  }

  getMonth(month: any) {

    switch (month) {
      case '01':
      case 1:
        return 'Jan';
      case '02':
      case 2:
        return 'Feb';
      case '03':
      case 3:
        return 'Mar';
      case '04':
      case 4:
        return 'Apr';
      case '05':
      case 5:
        return 'May';
      case '06':
      case 6:
        return 'Jun';
      case '07':
      case 7:
        return 'Jul';
      case '08':
      case 8:
        return 'Aug';
      case '09':
      case 9:
        return 'Sept';
      case '10':
      case 10:
        return 'Oct';
      case '11':
      case 11:
        return 'Nov';
      case '12':
      case 12:
        return 'Dec';
    }
  }
}
