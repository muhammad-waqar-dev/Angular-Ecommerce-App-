import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalMessageService } from '@spartacus/core';
import { PageLayoutService, ProductListComponent, ProductListComponentService, ProductListOutlets, ViewConfig } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { productConstants } from 'src/app/core/constants/general';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-product-item-grid',
  templateUrl: './product-item-grid.component.html',
  styleUrls: ['./product-item-grid.component.scss']
})
export class ProductItemGridComponent extends ProductListComponent {
  isInternStaff = new BehaviorSubject<boolean>(false);
  constructor(pageLayoutService: PageLayoutService,
    productListComponentService: ProductListComponentService,
    scrollConfig: ViewConfig, private permissionUtil: PermissionService,
    globalMessageService: GlobalMessageService,
    private shareEvents: ShareEvents, private router: Router) {
    super(pageLayoutService, productListComponentService, globalMessageService, scrollConfig);
    if(sessionStorage.getItem('internalUserState') == 'false') {
      this.isInternStaff.next(true);
    }
  }
  readonly ProductListOutlets = ProductListOutlets;

  @Input() model: any;
  @Input() product: any;
  @Input() showFilterSection: boolean;
  @Input() isMobile: boolean;

  isPricePermissionAllowed = false;
  productConstants = productConstants;


  ngOnInit(): void {
    super.ngOnInit();
    this.isPricePermissionAllowed = this.permissionUtil.isPermissionAllowed("fbPricingGroup")  || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');

  }

  openMTOContactForm() {
    this.shareEvents.productFormMTOsendEvent();
  }

  selectedProduct(product:any): any {
    return false; // To be removed if the page needs to reach PDP from PLP
      this.shareEvents.updateSelectedProduct(product);
      const url = this.getProductLink(product);
      this.router.navigate([url]);
  }

  getProductLink(product: any): string {
    return `/fi-spa/p/${product?.code}`;
  }

  hasDiscount(product: any) : boolean {
    return  (product?.potentialPromotions && product?.potentialPromotions[0]?.discountLabel);
  }

}
