import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyFIImagesComponent } from './whyfi-images.component';
import { UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';


@NgModule({
  declarations: [WhyFIImagesComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    AccesspermissionmessageModule
  ],
  exports: [WhyFIImagesComponent]
})
export class WhyFIImagesModule { }
