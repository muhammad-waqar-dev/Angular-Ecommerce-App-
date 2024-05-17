import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserdetailsComponent } from './userdetails.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FIConfirmationPopupModule } from '../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';



@NgModule({
  declarations: [UserdetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FIConfirmationPopupModule
  ]
})
export class UserdetailsModule { }
