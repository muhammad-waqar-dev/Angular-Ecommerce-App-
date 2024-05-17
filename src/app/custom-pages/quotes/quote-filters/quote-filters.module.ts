import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalsortpipeModule } from 'src/app/shared/pipes/globalsortpipe.module';



@NgModule({
  imports: [
    CommonModule,
    GlobalsortpipeModule
  ]
})
export class QuoteFiltersModule { }
