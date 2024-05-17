import { NgModule } from '@angular/core';
import { savedCartTranslationChunksConfig, savedCartTranslations } from "@spartacus/cart/saved-cart/assets";
import { SavedCartRootModule } from "@spartacus/cart/saved-cart/root";
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";

@NgModule({
  declarations: [],
  imports: [
    SavedCartRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      cartSavedCart: {
        module: () =>
          import('@spartacus/cart/saved-cart').then((m) => m.SavedCartModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: savedCartTranslations,
      chunks: savedCartTranslationChunksConfig,
    },
  })
  ]
})
export class CartSavedCartFeatureModule { }
