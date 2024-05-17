import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AccountDropDownStateService {
  private _accountState$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _selectedAccountState$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public _previouslyInvoked: any = null;
  isDataAvailable: boolean= false;

  get _getAccountState$(): Observable<any> {
    return this._accountState$.asObservable();
  }

  public setAccountState(data: any): void {
    this._accountState$.next({
      accountData: data
    });
    localStorage.setItem("emailID",data.email)
    localStorage.setItem("phoneNum",data.phoneNumber);
    localStorage.setItem("jobTitle",data.jobTitle);
    localStorage.setItem("name",data.name)
    this.isDataAvailable = true;
  }

  get _getSelectedAccountState$():   Observable<any> {
    return this._selectedAccountState$.asObservable();
  }

  public setSelectedAccountState(uid: any): void {
    let selectedAccount;
    this._accountState$.subscribe((data) => {
      if (uid == data.accountData.orgUnit.uid && data.accountData.orgUnit.branch) {
        selectedAccount = data.orgUnit;
      }
      else {
        selectedAccount = data.accountData.orgUnit.children.find(x => x.uid === uid);
      }
      this._previouslyInvoked = selectedAccount;
    })
    this._selectedAccountState$.next({
      selectedAccount: selectedAccount
    });
  }

  get previouslySelectedValue(): any {
    return this._previouslyInvoked;
  }

  get getAccountEmailId(){
    return localStorage.getItem("emailID");
  }

  get getAccountPhoneNum(){
    return localStorage.getItem("phoneNum");
  }
  get getjobTitle(){
    return localStorage.getItem("jobTitle");
  }
  get userdisplayName() {
    var displayName;
    this._accountState$.subscribe((data) => {
      displayName = data.accountData.name;
    });
    return displayName;
  }
}
