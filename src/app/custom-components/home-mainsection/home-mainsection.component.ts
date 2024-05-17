import { Component, OnInit } from '@angular/core';
import { CmsBannerComponent, CmsService } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-home-mainsection',
  templateUrl: './home-mainsection.component.html',
  styleUrls: ['./home-mainsection.component.scss']
})

export class HomeMainsectionComponent implements OnInit {
  landingPageTiles: any;

  showInternalStaffPopupOnfirstLoad$ = new BehaviorSubject<boolean>(false);

  constructor(private cmsService: CmsService, public component: CmsComponentData<CmsBannerComponent>,
    private shareEvents: ShareEvents) {
      let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
        if (component.uid == "FIHomepageWhyFiBannerComponent"  && CommonUtils.isMobile &&
          sessionStorage.getItem('internalUserState') == 'false' && !sessionStorage.getItem('fbCSRTradeAcc') && !window.location.href.includes('login') && !window.location.pathname.endsWith('login') &&
          auth0AccessToken?.userId == "current"){
            //console.log("initiating share event in homepage tiles component constructor");
            //this.shareEvents.internalStaffPopupSendEvent();
            this.showInternalStaffPopupOnfirstLoad$.next(true);
        }else{
          this.showInternalStaffPopupOnfirstLoad$.next(false);
        }
    }

  ngOnInit(): void {
    this.shareEvents.resetGlobalSearchSendEvent();
  }

  searchFormResult(event){
    //console.log("search form submitted inside m-header");
  }

  tileClicked(data) {
    //console.log("tileClicked",data);
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event':'HomeScreenUsage',
    'eventCategory': 'Home Screen Tile Click', //constant value
    'eventAction': data.media.desktop.altText//Pass the Tile Name that the user clicked
    });
  }
}
