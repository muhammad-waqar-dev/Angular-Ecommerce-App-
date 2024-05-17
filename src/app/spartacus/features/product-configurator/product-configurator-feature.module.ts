import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { configuratorTranslationChunksConfig, configuratorTranslations } from "@spartacus/product-configurator/common/assets";
import { RulebasedConfiguratorRootModule } from "@spartacus/product-configurator/rulebased/root";
import { TextfieldConfiguratorRootModule } from "@spartacus/product-configurator/textfield/root";

@NgModule({
  declarations: [],
  imports: [
    RulebasedConfiguratorRootModule,
    TextfieldConfiguratorRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      productConfiguratorRulebased: {
        module: () =>
          import('@spartacus/product-configurator/rulebased').then((m) => m.RulebasedConfiguratorModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: configuratorTranslations,
      chunks: configuratorTranslationChunksConfig,
    },
  }),
  provideConfig(<CmsConfig>{
    featureModules: {
      productConfiguratorTextfield: {
        module: () =>
          import('@spartacus/product-configurator/textfield').then((m) => m.TextfieldConfiguratorModule),
      },
    }
  })
  ]
})
export class ProductConfiguratorFeatureModule { }
