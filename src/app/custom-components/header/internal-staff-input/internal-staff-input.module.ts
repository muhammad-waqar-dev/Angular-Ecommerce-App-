import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InternalStaffInputComponent } from './internal-staff-input.component';

@NgModule({
  declarations: [InternalStaffInputComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  exports: [InternalStaffInputComponent],
})
export class InternalStaffInputModule { }
