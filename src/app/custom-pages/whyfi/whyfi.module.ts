import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyFIComponent } from './whyfi.component';;
import { CmsConfig, provideConfig, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';


@NgModule({
  declarations: [WhyFIComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    AccesspermissionmessageModule,
    SpinnerModule
  ],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        whyFIAssetLogo: {
          module: () =>
            import('./asset-library/images/whyfiimages.module').then((m) => m.WhyFIImagesModule),
          cmsComponents: ['SimpleResponsiveBannerComponent']
        },
      }
    }),
    provideConfig(<CmsConfig>{
      featureModules: {
        whyFIAssetLogo: {
          module: () =>
            import('./asset-library/edmsocial/whyfi-edmsocial.module').then((m) => m.WhyFIEDMSocialModule),
          cmsComponents: ['SimpleResponsiveBannerComponent']
        },
      }
    }),
    provideConfig(<CmsConfig>{
      featureModules: {
        whyFIAssetLogo: {
          module: () =>
            import('./asset-library/logos/whyfi-asset-logo.module').then((m) => m.WhyFIAssetLogoModule),
          cmsComponents: ['SimpleResponsiveBannerComponent']
        },
      }
    }),
    provideConfig(<CmsConfig>{
      featureModules: {
        whyFIAssetLogo: {
          module: () =>
            import('./asset-library/whyfiassetlib.module').then((m) => m.WhyFIAssetLibraryModule),
          cmsComponents: ['SimpleResponsiveBannerComponent']
        },
      }
    }),
    provideConfig(<CmsConfig>{
      featureModules: {
        whyFIAssetLogo: {
          module: () =>
            import('./training/whyfitraining.module').then((m) => m.WhyFITrainingModule),
          cmsComponents: ['SimpleResponsiveBannerComponent']
        },
      }
    }),
  ],
  exports: [WhyFIComponent],
})
export class WhyFIModule { }
