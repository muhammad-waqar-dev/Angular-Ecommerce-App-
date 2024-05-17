import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountsFiltersComponent } from './accounts-filters/accounts-filters.component';
import { GlobalsortpipeModule } from 'src/app/shared/pipes/globalsortpipe.module';
import { AccountsFiltersModule } from './accounts-filters/accounts-filters.module';
import { AccountsItemGridModule } from './accounts-item-grid/accounts-item-grid.module';
import { AccountsItemListModule } from './accounts-item-list/accounts-item-list.module';
import { AccountsDetailsModule } from './accounts-details/accounts-details.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IconModule, PaginationModule, SpinnerModule, ViewConfig } from '@spartacus/storefront';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountsMobileModule } from './accounts-mobile/accounts-mobile.module';
import { AccountsSearchModule } from './accounts-search/accounts-search.module';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AccountsCreditPaymentModule } from './acounts-credit-payment/acounts-credit-payment.module';
import { StatementsItemGridModule } from './statements-item-grid/statements-item-grid.module';
import { StatementsItemListModule } from './statements-item-list/statements-item-list.module';
import { StatementDetailsModule } from './statement-details/statement-details.module';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AccountComponent, AccountsFiltersComponent],
  imports: [
    CommonModule,
    GlobalsortpipeModule,
    AccountsItemGridModule,
    AccountsFiltersModule,
    AccountsItemListModule,
    SpinnerModule,
    IconModule,
    PaginationModule,
    InfiniteScrollModule,
    AccountsMobileModule,
    AccountsSearchModule,
    AccountsCreditPaymentModule,
    AccountsDetailsModule,
    StatementsItemGridModule,
    StatementsItemListModule,
    StatementDetailsModule,
    AccesspermissionmessageModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ConfigModule.withConfig({
      pagination: {
        addPrevious: true,
        addStart: false,
        addNext: true,
        addEnd: false
      }
    }),
  ],
  providers: [
    AccountsService,
    provideConfig(<ViewConfig>{
      view: {
        infiniteScroll: {
          active: CommonUtils.isMobile(),
          showMoreButton: false
        }
      }
    }),
   
  ]
})
export class AccountModule { }
