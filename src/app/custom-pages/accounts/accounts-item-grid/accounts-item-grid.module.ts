import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsGridComponent } from './accounts-item-grid.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AccountsGridComponent],
  exports: [AccountsGridComponent]
})
export class AccountsItemGridModule { }
