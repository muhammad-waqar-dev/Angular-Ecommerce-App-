import { Component, HostBinding, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoginFormComponentService } from '@spartacus/user/account/components';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  constructor(protected service: LoginFormComponentService) {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'event': 'Page-Details', //constant value
      'currentURL': window.location.href, // page url
      'currentPageTitle': 'Login', // enter if exists
      'pageType': 'Internal Staff Login',
      'isLoggedIn': 'Yes'
    });
  }

  form: UntypedFormGroup;
  isUpdating$: any;

  @HostBinding('class.user-form') style = true;

  ngOnInit(): void {
    this.form = this.service?.form;
    this.isUpdating$ = this.service?.isUpdating$;
  }

  formCheck(data) {
    this.form = new UntypedFormGroup({
      userId: new UntypedFormControl({ value: 'fi_' + data.userId, disabled: false }, [Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]),
      password: new UntypedFormControl({ value: data.password, disabled: false }, [Validators.required]),
    });
    this.service.form = this.form;
  }
  onSubmit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'eventCategory': 'Login Attempt', //constant value
    });
    this.formCheck(this.service.form.value);
    this.service.login();
    this.form = new UntypedFormGroup({
      userId: new UntypedFormControl({ value: this.service.form.value.userId.replace(/fi_/, ''), disabled: false }, [Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]),
      password: new UntypedFormControl({ value: this.service.form.value.password, disabled: false }, [Validators.required]),
    });
    this.service.form = this.form;
  }

}
