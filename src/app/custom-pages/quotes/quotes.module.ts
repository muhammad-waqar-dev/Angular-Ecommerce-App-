import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IconModule, PaginationModule, SpinnerModule, ViewConfig } from '@spartacus/storefront';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { CommonUtils } from 'src/app/core/utils/utils';

import { QuotesComponent } from './quotes.component';
import { QuoteItemsListModule } from './quote-items-list/quote-items-list.module';
import { QuoteItemsGridModule } from './quote-items-grid/quote-items-grid.module';
import { QuoteDetailsModule } from './quote-details/quote-details.module';
import { QuoteFiltersModule } from './quote-filters/quote-filters.module';
import { QuoteSearchModule } from './quote-search/quote-search.module';
import { QuoteFiltersComponent } from './quote-filters/quote-filters.component';
import { QuoteMobileModule } from './quote-mobile/quote-mobile.module';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { GlobalsortpipeModule } from 'src/app/shared/pipes/globalsortpipe.module';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';

@NgModule({
  declarations: [QuotesComponent, QuoteFiltersComponent],
  imports: [
    CommonModule,
    QuoteItemsListModule,
    QuoteItemsGridModule,
    QuoteDetailsModule,
    GlobalsortpipeModule,
    QuoteFiltersModule,
    QuoteSearchModule,
    SpinnerModule,
    QuoteMobileModule,
    PaginationModule,
    InfiniteScrollModule,
    IconModule,
    AccesspermissionmessageModule,
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
    QuoteService,
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
export class QuotesModule { }
