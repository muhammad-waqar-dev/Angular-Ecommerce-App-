import { NgModule } from '@angular/core';
import { CdsConfig, CdsModule } from "@spartacus/cds";
import { provideConfig } from "@spartacus/core";
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CdsModule.forRoot()
  ],
  providers: [provideConfig(<CdsConfig>{
    cds: {
      tenant: 'FI-B2B',
      baseUrl: environment.siteUrl,
     // baseUrl: 'https://spartacus-demo.eastus.cloudapp.azure.com:8443/',
      endpoints: {
        strategyProducts: '/strategy/${tenant}/strategies/${strategyId}/products',
      },
      merchandising: {
        defaultCarouselViewportThreshold: 80,
      },
      profileTag: {
        configUrl: 'url'
      },
    },
  }),
  provideConfig(<CdsConfig>{
    cds: {
      tenant: 'FIb2b',
      baseUrl: environment.siteUrl,
      endpoints: {
        strategyProducts: '/strategy/${tenant}/strategies/${strategyId}/products',
      },
      merchandising: {
        defaultCarouselViewportThreshold: 80,
      },
      profileTag: {
        configUrl: 'url',
        javascriptUrl : 'url'
      },
    },
  })
  ]
})
export class CdsFeatureModule { }
