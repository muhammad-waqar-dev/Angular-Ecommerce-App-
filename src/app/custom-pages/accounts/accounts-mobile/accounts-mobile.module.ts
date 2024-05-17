import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsMobileComponent } from './accounts-mobile.component';
import { AccountsItemGridModule } from '../accounts-item-grid/accounts-item-grid.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListNavigationModule } from '@spartacus/storefront';
import { AccountsItemListModule } from '../accounts-item-list/accounts-item-list.module';
import { AccountsDetailsModule } from '../accounts-details/accounts-details.module';
import { StatementsItemListModule } from '../statements-item-list/statements-item-list.module';
import { StatementsItemGridModule } from '../statements-item-grid/statements-item-grid.module';
import { StatementDetailsModule } from '../statement-details/statement-details.module';

@NgModule({
  imports: [
    CommonModule,
    AccountsItemGridModule,
    AccountsItemListModule,
    AccountsDetailsModule,
    InfiniteScrollModule,
    ListNavigationModule,
    StatementsItemGridModule,
    StatementsItemListModule,
    StatementDetailsModule
  ],
  declarations: [AccountsMobileComponent],
  exports: [AccountsMobileComponent]
})
export class AccountsMobileModule { }
