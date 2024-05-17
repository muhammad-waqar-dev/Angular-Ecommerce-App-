import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyFIAssetSocialComponent } from './whyfi-asset-social.component';
import { RouterModule } from '@angular/router';
import { IconModule, MediaModule, SpinnerModule } from '@spartacus/storefront';
import { UrlModule } from '@spartacus/core';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';



@NgModule({
  declarations: [WhyFIAssetSocialComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    AccesspermissionmessageModule,
    SpinnerModule
  ]
})
export class WhyFIEDMSocialModule { }
