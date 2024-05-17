import { EventEmitter } from '@angular/core';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { CmsService, ContentPageMetaResolver } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { createwhyfiConstants } from 'src/app/core/constants/general';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-whyfi-training',
  templateUrl: './whyfi-training.component.html',
  styleUrls: ['./whyfi-training.component.scss']
})
export class WhyFITrainingComponent implements OnInit, OnDestroy {

  isMobile: boolean = false;
  createwhyfiConstants = createwhyfiConstants;
  private subscription = new Subscription();
  fiAssetLibraryTrainingVideoBannerComponent: any[] = [];
  fiAssetLibraryTrainingResourceBannerComponent: any[] = [];
  fiAssetLibraryResourceBannerComponent: any[] = [];

  isLoading$ = new BehaviorSubject<boolean>(true);
  @Output() valueChange = new EventEmitter();
  permissionAllowed: boolean;


  constructor(private contentPageMetaResolver: ContentPageMetaResolver, private cmsService: CmsService,
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
    'currentPageTitle': 'Trainings', // enter if exists
    'pageType': 'Trainings',
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
      this.fiAssetLibraryTrainingVideoBannerComponent = [];
      this.fiAssetLibraryTrainingResourceBannerComponent = [];
      this.fiAssetLibraryResourceBannerComponent = [];
      for (let index = 0; index < listItems.length; index++) {
        this.subscription.add(this.cmsService.getComponentData(listItems[index].uid).subscribe((data) => {
          if (data.styleClasses == 'video') {
            this.fiAssetLibraryTrainingVideoBannerComponent.push(data);
          }
          else if (data.styleClasses == 'training') {
            this.fiAssetLibraryTrainingResourceBannerComponent.push(data);
          }
          else if (data.styleClasses == 'industry') {
            this.fiAssetLibraryResourceBannerComponent.push(data);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyBreadcrumbs() {
    this.subscription.add(this.contentPageMetaResolver.resolveBreadcrumbs().subscribe((data) => {
      data.push(
        { label: createwhyfiConstants.whyfi_Label, link: createwhyfiConstants.whyfi_Link },
        { label: createwhyfiConstants.whyfi_training_Label, link: createwhyfiConstants.whyfi_training_Link }
      )
    }));
  }
}
