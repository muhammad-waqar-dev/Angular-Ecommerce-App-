import { NgModule } from '@angular/core';
import { AsmOccModule } from "@spartacus/asm/occ";

import { CheckoutCoreModule } from "@spartacus/checkout/base/core";
import { CheckoutOccModule } from "@spartacus/checkout/base/occ";
import { AnonymousConsentsModule, AuthModule, CostCenterOccModule, ExternalRoutesModule, ProductModule, ProductOccModule, UserModule, UserOccModule } from "@spartacus/core";
import { AddressBookModule, AnonymousConsentManagementBannerModule, AnonymousConsentsDialogModule, BannerCarouselModule, BannerModule, BreadcrumbModule, 
  CategoryNavigationModule, CmsParagraphModule, ConsentManagementModule, FooterNavigationModule, HamburgerMenuModule, HomePageEventModule, LinkModule, LoginRouteModule, LogoutModule, MyCouponsModule, MyInterestsModule, NavigationEventModule, 
  NavigationModule, NotificationPreferenceModule, PaymentMethodsModule, ProductCarouselModule, ProductDetailsPageModule, ProductFacetNavigationModule, ProductImagesModule, ProductIntroModule, ProductListingPageModule, ProductListModule, 
  ProductPageEventModule, ProductReferencesModule, ProductSummaryModule, ProductTabsModule, 
  SearchBoxModule, SiteContextSelectorModule, StockNotificationModule, TabParagraphContainerModule } from "@spartacus/storefront";
import { AsmFeatureModule } from './features/asm/asm-feature.module';
import { CartSavedCartFeatureModule } from './features/cart/cart-saved-cart-feature.module';
import { CdcFeatureModule } from './features/cdc/cdc-feature.module';
import { CdsFeatureModule } from './features/cds/cds-feature.module';
import { OrganizationAdministrationFeatureModule } from './features/organization/organization-administration-feature.module';
import { OrganizationOrderApprovalFeatureModule } from './features/organization/organization-order-approval-feature.module';
import { ProductConfiguratorFeatureModule } from './features/product-configurator/product-configurator-feature.module';
import { ProductBulkPricingFeatureModule } from './features/product/product-bulk-pricing-feature.module';
import { ProductVariantsFeatureModule } from './features/product/product-variants-feature.module';
import { QualtricsFeatureModule } from './features/qualtrics/qualtrics-feature.module';
import { SmartEditFeatureModule } from './features/smartedit/smart-edit-feature.module';
import { StoreFinderFeatureModule } from './features/storefinder/store-finder-feature.module';
import { TagManagementFeatureModule } from './features/tracking/tag-management-feature.module';
import { UserFeatureModule } from './features/user/user-feature.module';
import { UserAccountModule, UserProfileModule } from '@spartacus/user';
import { CartBaseOccModule } from '@spartacus/cart/base/occ';
import { CartBaseCoreModule, CartPageEventModule } from '@spartacus/cart/base/core';
import { CartBaseFeatureModule } from './features/cart/cart-base-feature.module';
import { CheckoutComponentsModule, CheckoutLoginModule } from '@spartacus/checkout/base/components';
import { OrderCancellationModule, OrderConfirmationModule, OrderDetailsModule, OrderHistoryModule, OrderReturnModule, ReplenishmentOrderDetailsModule, ReplenishmentOrderHistoryModule, ReturnRequestDetailModule, ReturnRequestListModule } from '@spartacus/order/components';
import { WishListModule }  from '@spartacus/cart/wish-list';

@NgModule({
  declarations: [],
  imports: [
    // Auth Core
    AuthModule.forRoot(),
    LogoutModule,
    LoginRouteModule,
    // Basic Cms Components
    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    BreadcrumbModule,
    // User Core,
    UserModule,
    UserOccModule,
    // User UI,
    AddressBookModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,
    // Anonymous Consents Core,
    AnonymousConsentsModule.forRoot(),
    // Anonymous Consents UI,
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,
    // Product Core,
    ProductModule.forRoot(),
    ProductOccModule,
    // Product UI,
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductIntroModule,
    // Cart Core,
    CartBaseCoreModule,
    CartBaseOccModule,
    // Cart UI,
    CartBaseFeatureModule,
    WishListModule,
    // Checkout Core,
    CheckoutCoreModule,
    CheckoutOccModule,
    CostCenterOccModule,
    // Checkout UI,
    CheckoutLoginModule,
    CheckoutComponentsModule,
    OrderConfirmationModule,
    // Order,
    OrderHistoryModule,
    OrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule,
    ReplenishmentOrderHistoryModule,
    ReplenishmentOrderDetailsModule,
    OrderConfirmationModule,
    // Page Events,
    NavigationEventModule,
    HomePageEventModule,
    CartPageEventModule,
    ProductPageEventModule,
    UserFeatureModule,
    CdsFeatureModule,
    CdcFeatureModule,
    TagManagementFeatureModule,
    StoreFinderFeatureModule,
    SmartEditFeatureModule,
    QualtricsFeatureModule,
    ProductConfiguratorFeatureModule,
    ProductBulkPricingFeatureModule,
    ProductVariantsFeatureModule,
    OrganizationAdministrationFeatureModule,
    OrganizationOrderApprovalFeatureModule,
    CartSavedCartFeatureModule,
    AsmFeatureModule,
    
    ExternalRoutesModule.forRoot(),
    UserAccountModule,
    UserProfileModule,
    NavigationEventModule,
    AsmOccModule,
    UserOccModule
  ]
})
export class SpartacusFeaturesModule { }
