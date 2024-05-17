import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyFIAssetLibraryComponent } from './whyfi-asset-library.component';
import { UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';



@NgModule({
  declarations: [WhyFIAssetLibraryComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    AccesspermissionmessageModule,
    SpinnerModule
  ],
  exports: [WhyFIAssetLibraryComponent]
})
export class WhyFIAssetLibraryModule { }
