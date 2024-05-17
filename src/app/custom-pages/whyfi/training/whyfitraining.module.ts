import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyFITrainingComponent } from './whyfi-training.component';
import { UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';


@NgModule({
  declarations: [WhyFITrainingComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SpinnerModule,
    AccesspermissionmessageModule
  ],
  exports: [WhyFITrainingComponent]
})
export class WhyFITrainingModule { }
