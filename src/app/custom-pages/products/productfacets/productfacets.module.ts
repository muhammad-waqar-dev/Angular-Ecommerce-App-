import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductfacetsComponent } from './productfacets.component';
import { CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { ActiveFacetsModule, FacetListModule, FacetModule, IconModule, KeyboardFocusModule, ProductFacetNavigationModule } from '@spartacus/storefront';



@NgModule({
  declarations: [ProductfacetsComponent],
  imports: [
    CommonModule,
    ProductFacetNavigationModule,
    FacetListModule,
    FacetModule,
    ActiveFacetsModule,
    KeyboardFocusModule,
    RouterModule,
    UrlModule,
    IconModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductRefinementComponent: {
          component: ProductfacetsComponent
        }
      }
    } as CmsConfig)
  ],
  exports: [
    ProductfacetsComponent
  ]
})
export class ProductfacetsModule { }
