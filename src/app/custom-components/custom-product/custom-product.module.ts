import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProductComponent } from './custom-product.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';



@NgModule({
  declarations: [CustomProductComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({

    } as CmsConfig)
  ]
})
export class CustomProductModule { }
