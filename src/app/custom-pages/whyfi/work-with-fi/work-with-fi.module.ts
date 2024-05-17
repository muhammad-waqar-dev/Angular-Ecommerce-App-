import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkWithFiComponent } from './work-with-fi.component';
import { RouterModule } from '@angular/router';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';
import { SpinnerModule } from '@spartacus/storefront';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';



@NgModule({
  declarations: [WorkWithFiComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FIConfirmationPopupModule,
    SpinnerModule,
    AccesspermissionmessageModule
  ]
})
export class WorkWithFiModule { }
