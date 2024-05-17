import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementsItemListComponent } from './statements-item-list.component';



@NgModule({
  declarations: [StatementsItemListComponent],
  imports: [
    CommonModule
  ],
  exports: [StatementsItemListComponent]
})
export class StatementsItemListModule { }
