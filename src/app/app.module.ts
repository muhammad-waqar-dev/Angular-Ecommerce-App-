import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AuthConfig, ConfigModule, DeferLoadingStrategy, provideConfig, SearchboxService } from "@spartacus/core";
import { AppRoutingModule, LayoutConfig, ProductListComponentService } from "@spartacus/storefront";
import { AuthInterceptor } from './shared/interceptor/global-interceptor';
import { AppComponent } from './app.component';
import { CustomLayoutModule } from "./core/config/custom-layout/custom-layout.module";
import { ContactusModule } from "./custom-components/contactus/contactus.module";
import { CreateAccountComponent } from "./custom-components/create-account/create-account.component";
import { CustomMiniCartModule } from "./custom-components/custom-mini-cart/custom-mini-cart.module";
import { AccountdropdownModule } from "./custom-components/header/accountdropdown/accountdropdown.module";
import { SearchModule } from "./custom-components/header/search/search.module";
import { HelpSupportModule } from "./custom-components/help-support/help-support.module";
import { HomeMainsectionModule } from "./custom-components/home-mainsection/home-mainsection.module";
import { WelcometextModule } from "./custom-components/home-mainsection/welcometext/welcometext.module";
import { HomepagetilesModule } from "./custom-components/homepagetiles/homepagetiles.module";
import { TopaccountModule } from "./custom-components/topaccount/topaccount.module";
import { SpartacusModule } from './spartacus/spartacus.module';
import { DashboardPageModule } from "./custom-pages/dashboard-page/dashboard-page.module";
import { OrderDeliveriesModule } from "./custom-pages/order-deliveries/order-deliveries.module";
import { QuotesModule } from "./custom-pages/quotes/quotes.module";
import { ProductsModule } from "./custom-pages/products/products.module";
import { WhyFIModule } from "./custom-pages/whyfi/whyfi.module";
import { CustomFooterModule } from "./custom-components/custom-footer/custom-footer.module";
import { CreateAccountModule } from "./custom-components/create-account/create-account.module";
import { AccountModule } from "./custom-pages/accounts/account.module";
import { UserGuard } from "./core/guard/user-gaurd";
import { Auth0ModuleConfig } from "./shared/thirdparty/auth0.config";
import { environment } from "src/environments/environment";
import { ShareEvents } from "./shared/shareEvents.service";
import { MHeaderModule } from "./custom-components/mobile/m-header/m-header.module";
import { UserdetailsModule } from "./custom-pages/userdetails/userdetails.module";
import { SendNoteService } from "./core/service/sendNoteSevice.service";
import { ProductHelpService } from "./core/service/helpwithproduct.service";
import { WorkWithFiModule } from "./custom-pages/whyfi/work-with-fi/work-with-fi.module";
import { WhyFIAssetLibraryModule } from "./custom-pages/whyfi/asset-library/whyfiassetlib.module";
import { FifeatureModule } from "./FI-Features/fifeature/fifeature.module";
import { SpartacusAuth0ModuleConfig } from "./shared/thirdparty/spartacusauth0.config";
import { ProductextendService } from "./custom-pages/products/productextend.service";
import { SearchapiextendService } from "./custom-pages/products/searchapiextend.service";
import { FIUserAccountDetailsService } from "./core/service/userAccountDetails.service";
import { AccountDropDownStateService } from "./shared/services/accountsDropdownState.service";
import { MyTeamModule } from "./custom-pages/my-team/my-team.module";
import { UserAccountSelectionChangeService } from "./core/service/userAccountSelectionChange.service";
import { AddNewMemberService } from "./core/service/addNewTeamMember.service";
import { MyTeamService } from "./shared/services/my-team.service";
import { PermissionService } from "./core/service/permissions.services";
import { UserProfileDetailsService } from "./core/service/userprofileDetails.service";
import { OrderDeliveryItemGridModule } from "./custom-pages/order-deliveries/order-delivery-item-grid/order-delivery-item-grid.module";
import { CustomcheckoutModule } from "./custom-pages/checkout/customcheckout.module";
import { CartModule } from "./custom-pages/cart/cart.module";
import { SortPipe } from "./shared/pipes/sort.pipe";
import { GlobalsortpipeModule } from "./shared/pipes/globalsortpipe.module";
import { orderStepGaurd } from "./core/guard/orderStepGaurd";
import { PaymentService } from "./shared/services/payment.service";
import { WhyfiworkCatalystService } from "./core/service/whyfiworkcatalyst.service";
import { LoginPageModule } from "./custom-pages/login-page/login-page.module";
import { CustomPdpModule } from "./custom-pages/custom-pdp/custom-pdp.module";
import { CachingInterceptor } from "./shared/interceptor/caching.interceptor";
import { ErrorInterceptor } from "./shared/interceptor/error.interceptor";

import { GlobalErrorHandlerService } from "./shared/interceptor/global-error-handler.service";

// var authModule = [];
// if (!(window.location.pathname.includes("internalStaff"))) {
//   authModule.push(SpartacusAuth0ModuleConfig);
// }

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ConfigModule.withConfig({
      layoutSlots: {
        header: {
          sm: {
            slots: ['SiteContext', 'SiteLinks', 'MiniCart', 'SiteLogo', 'SearchBox']
          },
          xs: {
            slots: ['SiteContext', 'SiteLogo']
          }
        },
        footer: {
          lg: {
            slots: ['Footer']
          },
          md: {
            slots: ['Footer']
          },
          sm: {
            slots: ['Footer']
          },
          xs: {
            slots: []
          }
        }

      },
      routing: {
        //protected: true
      }
    } as LayoutConfig),
    CustomLayoutModule,
    BrowserModule,
    HttpClientModule,
    Auth0ModuleConfig,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SpartacusModule,
    SpartacusAuth0ModuleConfig,
    // ...authModule,
    CustomMiniCartModule,
    HomepagetilesModule,
    ContactusModule,
    HelpSupportModule,
    TopaccountModule,
    AccountdropdownModule,
    FifeatureModule,
    SearchModule,
    HomeMainsectionModule,
    WelcometextModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFooterModule,
    DashboardPageModule,
    OrderDeliveriesModule,
    QuotesModule,
    AccountModule,
    WhyFIModule,
    CreateAccountModule,
    MHeaderModule,
    UserdetailsModule,
    WhyFIAssetLibraryModule,
    WorkWithFiModule,
    MyTeamModule,
    OrderDeliveryItemGridModule,
    CustomcheckoutModule,
    CartModule,
    LoginPageModule,
    ProductsModule,
    CustomPdpModule
  ],
  providers: [provideConfig({ personalization: {} }),
    GlobalErrorHandlerService,
  { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  { provide: ProductListComponentService, useClass: ProductextendService },
  { provide: SearchboxService, useClass: SearchapiextendService },
    UserGuard,
    orderStepGaurd,
    ShareEvents,
    SendNoteService,
    ProductHelpService,
    WhyfiworkCatalystService,
    AccountDropDownStateService,
    FIUserAccountDetailsService,
    UserAccountSelectionChangeService,
    AddNewMemberService,
    MyTeamService,
    PermissionService,
    UserProfileDetailsService,
    PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
