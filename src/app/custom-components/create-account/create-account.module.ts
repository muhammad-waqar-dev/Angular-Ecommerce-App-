import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account.component';
import { MediaModule } from '@spartacus/storefront';
import { CreateAccountsService } from 'src/app/shared/services/create-accounts.service';
import { FIConfirmationPopupModule } from 'src/app/custom-pages/popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';



@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    MediaModule,
    BrowserModule,
    ReactiveFormsModule,
    FIConfirmationPopupModule
  ],
  exports: [
    CreateAccountComponent
  ],
  providers: [CreateAccountsService]
})
export class CreateAccountModule { }
