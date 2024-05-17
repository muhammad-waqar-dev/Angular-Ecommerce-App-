import { ForgotPasswordComponentService } from '@spartacus/user/profile/components';
import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent {
  constructor(protected service: ForgotPasswordComponentService) {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': '', // enter if exists
    'pageType': 'Internal Staff Forgot Password',
    'isLoggedIn': 'Yes'
    });
  }
  form: UntypedFormGroup = this.service.form;
  isUpdating$ = this.service.isUpdating$;

  formCheck(data) {
    this.service.form = new UntypedFormGroup({
      userEmail: new UntypedFormControl({ value: 'fi_' + data.userEmail, disabled: false }, [Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]),
    });
  }
  onSubmit(): void {
    this.formCheck(this.service.form.value);
    this.service.requestEmail();
  }
}