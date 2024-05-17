import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CmsSearchBoxComponent, RoutingService, WindowRef } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SearchBoxComponent {

  showInternalStaffComponent$ = new BehaviorSubject<boolean>(false);
  permissionAllowed: boolean;

  constructor(searchBoxComponentService: SearchBoxComponentService,
    componentData: CmsComponentData<CmsSearchBoxComponent>, winRef: WindowRef,
    routingService: RoutingService, private router: Router,
    private permissionUtil: PermissionService, private shareEvents: ShareEvents) {
    super(searchBoxComponentService, componentData, winRef, routingService)
    this.shareEvents.resetGlobalSearchReceiveEvent().subscribe((data) => {
      this.chosenWord = ''
    })

    // internal staff conditional logic
    let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));

    if (sessionStorage.getItem('internalUserState') == 'false' && !window.location.href.includes('login') && !window.location.pathname.endsWith('login') &&
      auth0AccessToken?.userId == "current") {
      //this.isInternalStaffLoged = true;

      // this.shareEvents.internalStaffPopupSendEvent();
      this.showInternalStaffComponent$.next(true);
    }
  }

  config = {
    displaySuggestions: true,
    displayProducts: true,
    displayProductImages: true,
    maxProducts: 120,
    maxSuggestions: 10,
    minCharactersBeforeRequest: 2
  };

  ngOnInit() {
    this.routingService?.getRouterState();
   // this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbProductsGroup");
  }

  routeProduct() {
    if (window.location.pathname.includes('search')) {
      this.router.navigate(['/my-products/all'])
    }
  }

  searchCheck() {
    this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbProductsGroup");
  }

  searchFormResult(event: any) {
    //console.log("rendered search form inside internal staff popup");
  }

}

