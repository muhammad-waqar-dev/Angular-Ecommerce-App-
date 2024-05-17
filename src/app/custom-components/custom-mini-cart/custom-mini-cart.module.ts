import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMiniCartComponent } from './custom-mini-cart.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { CartModule } from 'src/app/custom-pages/cart/cart.module';



@NgModule({
  declarations: [CustomMiniCartComponent],
  imports: [
    CommonModule,
    IconModule,
    UrlModule,
    RouterModule,
    CartModule,
    ConfigModule.withConfig({
      cmsComponents: {
        MiniCartComponent: {
          component: CustomMiniCartComponent
        }
      }
    } as CmsConfig)
  ],
  exports: [
    CustomMiniCartComponent
  ]
})
export class CustomMiniCartModule { }
