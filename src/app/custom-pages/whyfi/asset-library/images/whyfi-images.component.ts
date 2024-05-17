import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CmsService, ContentPageMetaResolver } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { createwhyfiConstants } from 'src/app/core/constants/general';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-whyfi-images',
  templateUrl: './whyfi-images.component.html',
  styleUrls: ['./whyfi-images.component.scss']
})
export class WhyFIImagesComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  createwhyfiConstants = createwhyfiConstants;
  private subscription = new Subscription();
  imagesBannerComponentList: any[] = [];

  isLoading$ = new BehaviorSubject<boolean>(true);
  @Output() valueChange = new EventEmitter();
  permissionAllowed: boolean;

  constructor(private contentPageMetaResolver: ContentPageMetaResolver,
    private cmsService: CmsService,
    private userDetails: AccountDropDownStateService,
    private permissionUtil: PermissionService,
    private shareEvents: ShareEvents) {
      this.applyBreadcrumbs();
  }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'Image Assets', // enter if exists
    'pageType': 'Image Assets',
    'isLoggedIn': 'Yes'
    });
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

  getComponentData() {
    this.isLoading$.next(true);
    this.subscription.add(this.cmsService.getCurrentPage().subscribe((ytList) => {
      let listItems = ytList.slots.Section3.components;
      this.imagesBannerComponentList = [];
      for (let index = 0; index < listItems.length; index++) {
        this.subscription.add(this.cmsService.getComponentData(listItems[index].uid).subscribe((data) => {
          if (data.styleClasses == 'assetimage') {
            this.imagesBannerComponentList.push(data);
          }
          if (index == listItems.length - 1) {
            this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbWhyFIGroup") || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
            if (!this.permissionAllowed) {
              (document.querySelector(".BottomHeaderSlot") as HTMLElement).style.display = 'none';
            }
            this.isLoading$.next(false);
            this.valueChange.emit(true);
          }
        }))
      }
    }));
  }

  getImagePath(url: string) {
    return environment.siteUrl + url;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyBreadcrumbs() {
    this.subscription.add(this.contentPageMetaResolver.resolveBreadcrumbs().subscribe((data) => {
      data.push(
        { label: createwhyfiConstants.whyfi_Label, link: createwhyfiConstants.whyfi_Link },
        { label: createwhyfiConstants.whyfiassets_Label, link: createwhyfiConstants.whyfiassets_Link },
        { label: createwhyfiConstants.whyfiassets_imagesassets_Label, link: createwhyfiConstants.whyfiassets_imagesassets_Link }
      )
    }));
    this.valueChange.emit(true);
  }
}
