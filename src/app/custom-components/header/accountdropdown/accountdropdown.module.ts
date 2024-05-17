import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountdropdownComponent } from './accountdropdown.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { InternalStaffInputModule } from '../internal-staff-input/internal-staff-input.module';

@NgModule({
  declarations: [AccountdropdownComponent, ConfirmationPopupComponent],
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    InternalStaffInputModule,
    ConfigModule.withConfig({
      cmsComponents: {
        FIAccountDropdownComponent: {
          component: AccountdropdownComponent,
        },
      },
    } as CmsConfig)
  ],
  exports: [AccountdropdownComponent]
})
export class AccountdropdownModule { }
