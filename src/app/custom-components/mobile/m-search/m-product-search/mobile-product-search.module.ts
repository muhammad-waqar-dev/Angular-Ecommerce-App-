import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileProductSearchComponent } from './m-product-search.component';
import { SearchBoxModule } from '@spartacus/storefront';
import { MyTeamSearchModule } from 'src/app/custom-pages/my-team/my-team-search/my-team-search.module';
import { FormsModule } from '@angular/forms';
import { OrderDeliveriesSearchModule } from 'src/app/custom-pages/order-deliveries/order-deliveries-search/order-deliveries-search.module';
import { QuoteSearchModule } from 'src/app/custom-pages/quotes/quote-search/quote-search.module';
import { AccountsSearchModule } from 'src/app/custom-pages/accounts/accounts-search/accounts-search.module';



@NgModule({
  declarations: [MobileProductSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    SearchBoxModule,
    MyTeamSearchModule,
    OrderDeliveriesSearchModule,
    QuoteSearchModule,
    AccountsSearchModule,
  ],
  exports: [MobileProductSearchComponent]
})
export class MobileProductSearchModule { }
