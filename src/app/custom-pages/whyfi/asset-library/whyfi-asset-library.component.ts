import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CmsService, ContentPageMetaResolver } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { createwhyfiConstants } from 'src/app/core/constants/general';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-whyfi-asset-library',
  templateUrl: './whyfi-asset-library.component.html',
  styleUrls: ['./whyfi-asset-library.component.scss']
})
export class WhyFIAssetLibraryComponent implements OnInit, OnDestroy {
  whyFIAssetsLibraryImagesBannerComponentData: any;
  whyFIAssetLibraryEMDBannerComponentData: any;
  whyFIAssetLibraryLogosBannerComponent: any;
  createwhyfiConstants = createwhyfiConstants;
  isMobile: boolean = false;
  private subscription = new Subscription();

  isLoading$ = new BehaviorSubject<boolean>(true);
  @Output() valueChange = new EventEmitter();
  permissionAllowed: boolean;

  constructor(private cmsService: CmsService,
    private contentPageMetaResolver: ContentPageMetaResolver,
    private userDetails: AccountDropDownStateService,
    private permissionUtil: PermissionService,
    private shareEvents: ShareEvents) {
      this.applyBreadcrumbs();
  }

  ngOnInit(): void {
    if(window.location.href.includes('asset-library')) {
      (<any>window).dataLayer = (<any>window).dataLayer || [];
      (<any>window).dataLayer.push({
      'event': 'Page-Details', //constant value
      'currentURL': window.location.href, // page url
      'currentPageTitle': 'fletcher Insulation Asset Library Page', // enter if exists
      'pageType': 'Asset Library',
      'isLoggedIn': 'Yes'
      });
    }
    this.isMobile = CommonUtils.isMobile();
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getComponentData() {
    this.subscription.add(this.cmsService.getComponentData('FIAssetLibraryImagesBannerComponent').subscribe((data) => {
      this.whyFIAssetsLibraryImagesBannerComponentData = data;
    }));
    this.subscription.add(this.cmsService.getComponentData('FIAssetLibraryEMDBannerComponent').subscribe((data) => {
      this.whyFIAssetLibraryEMDBannerComponentData = data;
    }));
    this.subscription.add(this.cmsService.getComponentData('FIAssetLibraryLogosBannerComponent').subscribe((data) => {
      this.whyFIAssetLibraryLogosBannerComponent = data;
      this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbWhyFIGroup") || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
      if (!this.permissionAllowed) {
        (document.querySelector(".BottomHeaderSlot") as HTMLElement).style.display = 'none';
      }
      this.isLoading$.next(false);
      this.valueChange.emit(true);
    }));
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
