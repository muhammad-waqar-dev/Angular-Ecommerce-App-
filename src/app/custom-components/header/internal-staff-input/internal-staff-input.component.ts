import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-internal-staff-input',
  templateUrl: './internal-staff-input.component.html',
  styleUrls: ['./internal-staff-input.component.scss']
})
export class InternalStaffInputComponent implements OnInit {

  showInternalStaffBox$ = new BehaviorSubject<boolean>(false);
  internalUserNumber:string = '';

  constructor(
    private shareEvents: ShareEvents
  ) {
    if(sessionStorage.getItem("internalUserState") == 'false' && !sessionStorage.getItem("fbCSRTradeAccName")){

      this.shareEvents.receiveInternalUserNumber().subscribe(data => {

        //console.log("data received in receiveInternalUserNumber ", data);

        if (data.userNumber) {

          //console.log("data in internal staff input component",data);

          this.showInternalStaffBox$.next(true);

          this.internalUserNumber = data.userNumber;

        } else { }

      });

    }else{

      if(sessionStorage.getItem("internalUserState") == 'false' && sessionStorage.getItem("fbCSRTradeAccName")){

        this.showInternalStaffBox$.next(true);

        this.internalUserNumber = sessionStorage.getItem("fbCSRTradeAccName");

      }

    }
  }

  ngOnInit(): void {
  }

  openPopupForInternalStaff() {
    let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
    //console.log("auth token ", auth0AccessToken);
    if (sessionStorage.getItem('internalUserState') == 'false' && !window.location.href.includes('login') && !window.location.pathname.endsWith('login') &&
      auth0AccessToken?.userId == "current") {
      //console.log("initiating share event in dashboard component constructor");
      this.shareEvents.internalStaffPopupSendEvent();
    }
  }

}
