import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, FeaturesConfigModule, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { ProductsComponent } from './products.component';
import { ProductHelpPopupModule } from './product-help-popup/product-help-popup.module';
import { RouterModule } from '@angular/router';
import { IconModule, ItemCounterModule, ListNavigationModule, MediaModule, OutletModule, PageLayoutService, ProductGridItemComponent, ProductListItemComponent, ProductListModule, SpinnerModule, StarRatingModule, ViewConfig } from '@spartacus/storefront';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ProductfacetsModule } from './productfacets/productfacets.module';
import { ProductItemGridModule } from './product-item-grid/product-item-grid.module';
import { ProductsMobileModule } from './products-mobile/products-mobile.module';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';



@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    AddToCartModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    StarRatingModule,
    IconModule,
    SpinnerModule,
    InfiniteScrollModule,
    FeaturesConfigModule,
    OutletModule,
    ProductHelpPopupModule,
    ProductfacetsModule,
    ProductItemGridModule,
    ProductsMobileModule,
    AccesspermissionmessageModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductGridComponent: {
          component: ProductsComponent
        },
        SearchResultsGridComponent: {
          component: ProductsComponent
        }
      },
    } as CmsConfig),
    ConfigModule.withConfig({
      pagination: {
        addPrevious: true,
        addStart: false,
        addNext: true,
        addEnd: false
      }
    })
  ],
  exports: [
  ],
  providers: [
    PageLayoutService,
    provideConfig(<ViewConfig>{
      view: {
        infiniteScroll: {
          active: CommonUtils.isMobile(),
          showMoreButton: false
        }
      }
    }),
    provideConfig({
      backend: {
        occ: {
          endpoints: {
            productSearch:
              'products/search?fields=DEFAULT,facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery&pageSize=12'
          }
        }
      }
    })
  ]
})
export class ProductsModule { }
