import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { StatementDetailsComponent } from './statement-details.component';



@NgModule({
  declarations: [StatementDetailsComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [StatementDetailsComponent],
})
export class StatementDetailsModule { }
