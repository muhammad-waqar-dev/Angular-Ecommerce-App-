import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsSearchComponent } from './accounts-search.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateCustomParserFormatter } from '../../../shared/services/ngDateParserFormatter.service';
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [AccountsSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule 
  ],
  exports: [AccountsSearchComponent],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class AccountsSearchModule { }
