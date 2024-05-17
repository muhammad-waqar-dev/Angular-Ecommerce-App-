import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteItemsGridComponent } from './quote-items-grid.component';

@NgModule({
  declarations: [QuoteItemsGridComponent],
  imports: [
    CommonModule
  ],
  exports: [QuoteItemsGridComponent],
})
export class QuoteItemsGridModule { }
