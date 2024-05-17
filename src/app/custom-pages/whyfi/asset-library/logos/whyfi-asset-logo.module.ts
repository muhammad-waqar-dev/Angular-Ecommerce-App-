import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyFIAssetLogoComponent } from './whyfi-asset-logo.component';
import { IconModule, MediaModule, SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { UrlModule } from '@spartacus/core';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';



@NgModule({
  declarations: [WhyFIAssetLogoComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    AccesspermissionmessageModule
  ]
})
export class WhyFIAssetLogoModule { }
