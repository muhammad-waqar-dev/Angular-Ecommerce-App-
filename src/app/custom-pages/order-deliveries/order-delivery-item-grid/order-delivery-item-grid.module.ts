import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDeliveryItemGridComponent } from './order-delivery-item-grid.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OrderDeliveryItemGridComponent],
  exports: [OrderDeliveryItemGridComponent]
})
export class OrderDeliveryItemGridModule { }
