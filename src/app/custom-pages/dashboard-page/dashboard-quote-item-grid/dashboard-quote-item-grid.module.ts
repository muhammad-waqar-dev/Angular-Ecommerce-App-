import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardQuoteItemsGridComponent } from './dashboard-quote-item-grid.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DashboardQuoteItemsGridComponent],
  exports: [DashboardQuoteItemsGridComponent]
})
export class DashboardQuoteItemGridModule { }
