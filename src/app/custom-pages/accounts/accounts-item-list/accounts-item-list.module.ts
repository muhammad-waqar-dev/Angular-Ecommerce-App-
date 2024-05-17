import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsItemListComponent } from './accounts-item-list.component';



@NgModule({
  declarations: [AccountsItemListComponent],
  imports: [
    CommonModule
  ],
  exports: [AccountsItemListComponent]
})
export class AccountsItemListModule { }
