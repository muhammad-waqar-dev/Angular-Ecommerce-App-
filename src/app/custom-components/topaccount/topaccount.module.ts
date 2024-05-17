import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopaccountComponent } from './topaccount.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { IconModule, MediaModule } from '@spartacus/storefront';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [TopaccountComponent],
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    MediaModule,
    IconModule,
    NgbModule,
    ConfigModule.withConfig({
      cmsComponents: {
        FIAccountComponent: {
          component: TopaccountComponent,
        },
      },
    } as CmsConfig)
  ]
})
export class TopaccountModule { }
