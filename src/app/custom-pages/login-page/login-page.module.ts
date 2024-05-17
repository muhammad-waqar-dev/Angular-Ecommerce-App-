import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorsModule, SpinnerModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';

@NgModule({
  declarations: [LoginPageComponent, ForgotPasswordPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
    SpinnerModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ReturningCustomerLoginComponent: {
          component: LoginPageComponent,
        },
        ForgotPasswordComponent: {
          component: ForgotPasswordPageComponent
        }
      },
    } as CmsConfig),
  ]
})
export class LoginPageModule { }
