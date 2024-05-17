import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteDetailsComponent } from './quote-details.component';
import { RouterModule } from '@angular/router';
import { SpinnerModule } from '@spartacus/storefront';

@NgModule({
  declarations: [QuoteDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule
  ],
  exports: [QuoteDetailsComponent],
})
export class QuoteDetailsModule { }
