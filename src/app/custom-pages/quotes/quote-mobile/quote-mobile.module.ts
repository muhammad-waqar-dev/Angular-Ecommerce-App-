import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListNavigationModule } from '@spartacus/storefront';
import { QuoteItemsGridModule } from '../quote-items-grid/quote-items-grid.module';
import { QuoteItemsListModule } from '../quote-items-list/quote-items-list.module';
import { QuoteMobileComponent } from './quote-mobile.component';
import { QuoteDetailsModule } from '../quote-details/quote-details.module';

@NgModule({
  imports: [
    CommonModule,
    QuoteItemsGridModule,
    QuoteItemsListModule,
    InfiniteScrollModule,
    ListNavigationModule,
    QuoteDetailsModule
  ],
  declarations: [QuoteMobileComponent],
  exports: [QuoteMobileComponent]
})
export class QuoteMobileModule { }
