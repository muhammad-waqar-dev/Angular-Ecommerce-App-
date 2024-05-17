import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerModule } from '@spartacus/storefront';
import { InternalStaffComponent } from './internal-staff.component';

@NgModule({
  declarations: [
    InternalStaffComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    SpinnerModule,
    BrowserModule,
    NgbModule
  ],
  exports: [InternalStaffComponent]
})
export class InternalStaffModule { }
