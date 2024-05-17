import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDeliveriesSearchComponent } from './order-deliveries-search.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateCustomParserFormatter } from '../../../shared/services/ngDateParserFormatter.service';
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [OrderDeliveriesSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule 
  ],
  exports: [OrderDeliveriesSearchComponent],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class OrderDeliveriesSearchModule { }
