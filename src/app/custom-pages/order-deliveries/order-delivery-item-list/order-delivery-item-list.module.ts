import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDeliveryItemListComponent } from './order-delivery-item-list.component';



@NgModule({
  declarations: [OrderDeliveryItemListComponent],
  imports: [
    CommonModule
  ],
  exports: [OrderDeliveryItemListComponent]
})
export class OrderDeliveryItemListModule { }
