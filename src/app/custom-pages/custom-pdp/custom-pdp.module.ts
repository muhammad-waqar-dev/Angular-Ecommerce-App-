import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProdcutSummaryComponent } from './custom-prodcut-summary/custom-prodcut-summary.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { PotentialPromotionsComponent } from './custom-prodcut-summary/potential-promotions/potential-promotions.component';



@NgModule({
  declarations: [CustomProdcutSummaryComponent, PotentialPromotionsComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSummaryComponent: {
          component: CustomProdcutSummaryComponent
        }
      }
    } as CmsConfig)
  ]
})
export class CustomPdpModule { }
