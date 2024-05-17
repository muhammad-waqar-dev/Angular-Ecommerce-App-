import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { storeFinderTranslationChunksConfig, storeFinderTranslations } from "@spartacus/storefinder/assets";
import { StoreFinderRootModule } from "@spartacus/storefinder/root";

@NgModule({
  declarations: [],
  imports: [
    StoreFinderRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      storeFinder: {
        module: () =>
          import('@spartacus/storefinder').then((m) => m.StoreFinderModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: storeFinderTranslations,
      chunks: storeFinderTranslationChunksConfig,
    },
  })
  ]
})
export class StoreFinderFeatureModule { }
