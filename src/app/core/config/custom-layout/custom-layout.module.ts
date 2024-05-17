import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule } from '@spartacus/core';
import { CmsPageGuard, LayoutConfig } from '@spartacus/storefront';
import { AccessGuard } from '../../guard/access-gaurd';
import { RouterModule } from '@angular/router';
import { DashboardPageComponent } from 'src/app/custom-pages/dashboard-page/dashboard-page.component';
import { AccountComponent } from 'src/app/custom-pages/accounts/account.component';
import { ProductsComponent } from 'src/app/custom-pages/products/products.component';
import { WhyFIComponent } from 'src/app/custom-pages/whyfi/whyfi.component';
import { QuotesComponent } from 'src/app/custom-pages/quotes/quotes.component';
import { OrderDeliveriesComponent } from 'src/app/custom-pages/order-deliveries/order-deliveries.component';
import { CreateAccountComponent } from 'src/app/custom-components/create-account/create-account.component';
import { UserdetailsComponent } from 'src/app/custom-pages/userdetails/userdetails.component';
import { WhyFIAssetLibraryComponent } from 'src/app/custom-pages/whyfi/asset-library/whyfi-asset-library.component';
import { WhyFIImagesComponent } from 'src/app/custom-pages/whyfi/asset-library/images/whyfi-images.component';
import { WhyFITrainingComponent } from 'src/app/custom-pages/whyfi/training/whyfi-training.component';
import { WhyFIAssetSocialComponent } from 'src/app/custom-pages/whyfi/asset-library/edmsocial/whyfi-asset-social.component';
import { WhyFIAssetLogoComponent } from 'src/app/custom-pages/whyfi/asset-library/logos/whyfi-asset-logo.component';
import { WorkWithFiComponent } from 'src/app/custom-pages/whyfi/work-with-fi/work-with-fi.component';
import { MyTeamComponent } from 'src/app/custom-pages/my-team/my-team.component';
import { CartComponent } from 'src/app/custom-pages/cart/cart.component';
import { InternalStaffComponent } from 'src/app/custom-pages/internal-staff/internal-staff.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      layoutSlots: {
        LandingPage2Template: {
          lg: {
          }
        },
        LandingPage3Template: {},
        LandingPage4Template: {}
      },
    } as LayoutConfig),
    RouterModule.forChild([
      {
        path: 'create-account',
        component: CreateAccountComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'my-dashboard',
        component: DashboardPageComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'user-profile',
        component: UserdetailsComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'my-orders-deliveries',
        component: OrderDeliveriesComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'my-quotes',
        component: QuotesComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'my-products',
        component: ProductsComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'my-accounts',
        component: AccountComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'why-fi',
        component: WhyFIComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'asset-library',
        component: WhyFIAssetLibraryComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'image-assets',
        component: WhyFIImagesComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'trainings',
        component: WhyFITrainingComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'edm-social',
        component: WhyFIAssetSocialComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'logos',
        component: WhyFIAssetLogoComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'work-with-fi',
        component: WorkWithFiComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'my-team',
        component: MyTeamComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [CmsPageGuard]
      },
      {
        path: 'internalStaff',
        component: InternalStaffComponent,
        canActivate: [CmsPageGuard, AccessGuard]
      },
    ]),
  ]
})
export class CustomLayoutModule { }
