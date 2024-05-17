import { NgModule } from '@angular/core';
import { CdcConfig, CdcRootModule, CDC_FEATURE } from "@spartacus/cdc/root";
import { CmsConfig, provideConfig } from "@spartacus/core";

@NgModule({
  declarations: [],
  imports: [
    CdcRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CDC_FEATURE]: {
        module: () =>
          import('@spartacus/cdc').then((m) => m.CdcModule),
      },
    }
  }),
  provideConfig(<CdcConfig>{
    cdc: [
      {
        baseSite: 'FI-spa',
        javascriptUrl: '<url-to-cdc-script>',
        sessionExpiration: 3600
      },
    ],
  }),
  provideConfig(<CdcConfig>{
    cdc: [
      {
        baseSite: 'electronics-spa',
        javascriptUrl: '<url-to-cdc-script>',
        sessionExpiration: 3600
      },
    ],
  })
  ]
})
export class CdcFeatureModule { }
