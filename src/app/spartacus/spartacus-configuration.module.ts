import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { CmsConfig, DeferLoadingStrategy, FeaturesConfig, I18nConfig, OccConfig, provideConfig, SiteContextConfig } from "@spartacus/core";
import { defaultB2bOccConfig } from "@spartacus/setup";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";
import { environment } from 'src/environments/environment';
import { defaultB2BCheckoutConfig } from '@spartacus/checkout/b2b/root';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: environment.siteUrl,
       prefix: 'fletcherwebservices/v2/'
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      currency: ['AUD'],
      language: ['en'],
      urlParameters: ['baseSite'],
      baseSite: ['fi-spa']
    },
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '6.0'
    }
  }), provideConfig(defaultB2bOccConfig), provideConfig(defaultB2BCheckoutConfig), provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: environment.siteUrl,
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      currency: ['AUD'],
      language: ['en'],
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '6.0'
    }
  }),
  // DeferredLoading if the components are not in viewport
  provideConfig(<CmsConfig>{
    deferredLoading: {
      strategy: DeferLoadingStrategy.DEFER,
      intersectionMargin: '90px'
    }
  }),
]
})
export class SpartacusConfigurationModule { }
