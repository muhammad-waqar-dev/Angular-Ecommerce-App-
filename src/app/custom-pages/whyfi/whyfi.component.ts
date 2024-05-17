import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ContentPageMetaResolver } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { createwhyfiConstants } from 'src/app/core/constants/general';
import { CmsService } from '@spartacus/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-whyfi',
  templateUrl: './whyfi.component.html',
  styleUrls: ['./whyfi.component.scss']
})
export class WhyFIComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input('isDashboard') isDashboard: boolean = false;

  createwhyfiConstants = createwhyfiConstants;
  private subscription = new Subscription();

  constructor(private cmsService: CmsService,
    private contentPageMetaResolver: ContentPageMetaResolver,
    private userDetails: AccountDropDownStateService,
    private permissionUtil: PermissionService,
    private shareEvents: ShareEvents) {
    this.shareEvents.resetGlobalSearchSendEvent();
    this.applyBreadcrumbs();
  }

  isMobile: boolean = false;

  heading: string = '';
  assetLibrary;
  training;
  workingWithWifi;
  descBanner;
  bannerDescription;
  permissionAllowed: boolean;

  isLoading$ = new BehaviorSubject<boolean>(true);
  @Output() valueChange = new EventEmitter();

  ngOnInit(): void {
    if(window.location.href.includes('why-fi')) {
      (<any>window).dataLayer = (<any>window).dataLayer || [];
      (<any>window).dataLayer.push({
      'event': 'Page-Details', //constant value
      'currentURL': window.location.href, // page url
      'currentPageTitle': 'fletcher Insulation Why FI Page', // enter if exists
      'pageType': 'Why FI?',
      'isLoggedIn': 'Yes'
      });
    }
    // If Data Load is Still In Progress
    if (this.userDetails._getAccountState$ && this.userDetails.isDataAvailable) {
      this.getComponentData();
    } else {
      // Register the Receive Event and do the Needful
      this.shareEvents.accountsInfoAvailableSubjectReceiveEvent().subscribe(() => {
        this.getComponentData();
      });
    }
  }

  ngAfterViewChecked(): void {
    this.valueChange.emit(true);
  }

  getScreenSize() {
    const browserZoomLevel = window.devicePixelRatio;
    if (browserZoomLevel > 1) {
      document.querySelector('body').classList.add('appScaleLevel');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getComponentData() {
    this.cmsService.getComponentData('FIWhyTextParagraph').subscribe(data => {
      this.heading = data['content'];
      this.getScreenSize();
      this.isMobile = CommonUtils.isMobile();
    })
 
    this.cmsService.getComponentData('FIWhyFipageAssetLibraryBannerComponent').subscribe((data) => {
      this.assetLibrary = data;
    })
    this.cmsService.getComponentData('FIWhyFipageTrainingBannerComponent').subscribe((data) => {
      this.training = data;
    })
    this.cmsService.getComponentData('FIWhyFipageWorkingWithFIBannerComponent').subscribe((data) => {
      this.workingWithWifi = data;
    })
    this.cmsService.getComponentData('FIWhyFipageDescriptionBannerComponent').subscribe((data) => {
      this.descBanner = data;
    })
    this.cmsService.getComponentData('FIWhyBannerTextParagraph').subscribe((data) => {
      this.bannerDescription = data;

      this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbWhyFIGroup") || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
      if (!this.permissionAllowed) {
        (document.querySelector(".BottomHeaderSlot") as HTMLElement).style.display = 'none';
      }
      this.isLoading$.next(false);
      this.valueChange.emit(true);
    })
  }

  applyBreadcrumbs() {
    this.subscription.add(this.contentPageMetaResolver.resolveBreadcrumbs().subscribe((data) => {
      data.push(
        { label: createwhyfiConstants.whyfi_Label, link: createwhyfiConstants.whyfi_Link },
        { label: createwhyfiConstants.whyfiassets_Label, link: createwhyfiConstants.whyfiassets_Link }
      )
    }));
  }
}
