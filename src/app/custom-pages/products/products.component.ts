import { Component, ViewChild, ChangeDetectorRef, Output, OnDestroy } from '@angular/core';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import {
  PageLayoutService,
  ProductListComponent,
  ProductListComponentService,
  ProductListOutlets,
  ViewConfig,
} from '@spartacus/storefront';
import { CommonUtils } from 'src/app/core/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductfacetsComponent } from './productfacets/productfacets.component';
import { ProductextendService } from './productextend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { productDisclaimr } from 'src/app/core/constants/general';
import { SearchapiextendService } from './searchapiextend.service';
import { GlobalMessageService, ProductSearchService } from '@spartacus/core';
import { filter } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends ProductListComponent implements OnDestroy {
  readonly ProductListOutlets = ProductListOutlets;
  productDisclaimr = productDisclaimr;
  subscription$: Subscription
  constructor(
    private modalService: NgbModal,
    pageLayoutService: PageLayoutService,
    productListComponentService: ProductListComponentService,
    scrollConfig: ViewConfig,
    globalMessageService: GlobalMessageService,
    private shareEvents: ShareEvents,
    private productextendService: ProductextendService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userDetails: AccountDropDownStateService,
    private searchapiextendService: SearchapiextendService,
    protected productSearchService: ProductSearchService,
    private permissionUtil: PermissionService,
    private cacheService: CacheService
  ) {
    super(pageLayoutService, productListComponentService, globalMessageService, scrollConfig);
    if(!(window.location.pathname.includes('search'))) {
      this.shareEvents.resetGlobalSearchSendEvent();
    }
  }

  divContent = true;
  countVal = 0;

  hideAccordion = [];
  isMobile = CommonUtils.isMobile();
  showFilterSection: boolean = true;
  facetState = [[]];
  subFacetState = [[]];
  facetCategoryState = [];
  modalRef: any;
  isModalOpened = false;
  modalState = false;
  className: any;
  defaultPageSize = 24;

  isLoading$ = new BehaviorSubject<boolean>(true);
  @Output() valueChange = new EventEmitter();
  permissionAllowed: boolean;
  resetFilters: boolean = false;

  @ViewChild(ProductfacetsComponent, { static: false }) ProductfacetsComponent;

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'Products', // enter if exists
    'pageType': 'Products',
    'isLoggedIn': 'Yes'
    });
    super.ngOnInit();
    // If Data Load is Still In Progress
    if (
      this.userDetails._getAccountState$ &&
      this.userDetails.isDataAvailable
    ) {
      this.init();
    } else {
      // Register the Receive Event and do the Needful
      this.shareEvents
        .accountsInfoAvailableSubjectReceiveEvent()
        .subscribe(() => {
          this.init();
        });
    }
  }

  init() {
    // on page load the default selection is Residential, so navigate there
    if (
      (this.route.snapshot.queryParamMap.get('query') == null ||
        this.route.snapshot.queryParamMap.get('query') == undefined) &&
      !window.location.pathname.includes('search')
    ) {
      this.navigateToResidential();
    }
    this.addCloumnGrid();
    this.productData();
    this.permissionAllowed = this.permissionUtil.isPermissionAllowed('fbProductsGroup') || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
    this.productSearchVal();
    this.valueChange.emit(true);
  }

  productData() {
    this.subscription$ = this.model$.subscribe((data) => {
      data?.facets?.forEach((e, i) => {
        this.hideAccordion[i] = false;
        this.facetState[i] = [];

        if (this.productextendService.facetCategoryState[e.name]) {
          this.facetCategoryState[e.name] = true;
        } else {
          this.facetCategoryState[e.name] = false;
        }
        e.values.forEach((k, j) => {
          this.facetState[i][j] = data.facets[i].values[j].selected;
        });
      });

      this.shareEvents.productMenuSubjectReceiveEvent().subscribe(() => {
        this.openPopup();
      });

      this.productextendService.facetCategoryState = this.facetCategoryState;
      this.isLoading$.next(false);
    });
  }

  productSearchVal() {
    setTimeout(() => {
    let productVal = this.productSearchService
      .getResults()
      .pipe(filter((searchResult) => Object.keys(searchResult).length <= 0));
    productVal.subscribe((data) => {
      this.permissionAllowed = false;
        this.isLoading$.next(false);
    });
    }, 13000);
  }

  addCloumnGrid() {
    if (window.outerWidth >= 1700) {
      this.className = 'col-12 col-sm-6 col-md-4 col-xl-3';
    } else {
      this.className = 'col-12 col-sm-6 col-md-4';
    }
  }

  navigateToResidential() {
    let queryParam = ':fq=segment:Residential';
    this.router.navigate(['/my-products/all'], {
      queryParams: { query: queryParam },
      replaceUrl: true,
    });
  }

  openFacetPopup(content: any) {
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }
  openPopup() {
    this.modalRef = this.modalService.open(ProductfacetsComponent, {
      centered: true,
      size: 'lg',
    });
    this.model$.subscribe((event) => {
      this.modalRef.componentInstance.model = event;
      this.modalRef.componentInstance.facetState = this.facetState;
      this.modalRef.componentInstance.facetCategoryState =
        this.facetCategoryState;
      this.modalRef.componentInstance.subFacetState = this.subFacetState;
    });
  }
  closePopup() {
    this.shareEvents.productMenuSubjectSendEvent();
  }
  toggleDivContent() {
    this.divContent = !this.divContent;
    this.showFilterSection = !this.showFilterSection;
  }

  toggleFilterItems(i: any) {
    this.hideAccordion[i] = !this.hideAccordion[i];
  }

  productsPerPageSelectionChange(value: any) {
    this.productextendService.defaultPageSize = value;
    this.cacheService.setProductsPageSize(value);
    this.productextendService.getPageItems(0);
  }

  resetFilterFalse(e) {
    this.resetFilters = e;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe()
  }
}
