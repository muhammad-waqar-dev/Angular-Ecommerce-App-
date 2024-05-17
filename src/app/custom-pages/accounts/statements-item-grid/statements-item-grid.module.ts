import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementsGridComponent } from './statements-item-grid.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatementsGridComponent],
  exports: [StatementsGridComponent]
})
export class StatementsItemGridModule { }
