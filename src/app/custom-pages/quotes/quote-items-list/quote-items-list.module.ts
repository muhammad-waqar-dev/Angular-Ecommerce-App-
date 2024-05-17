import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuoteItemsListComponent } from '../quote-items-list/quote-items-list.component';


@NgModule({
  declarations: [
    QuoteItemsListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    QuoteItemsListComponent
  ],
})
export class QuoteItemsListModule { }
