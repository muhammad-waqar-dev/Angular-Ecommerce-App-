import { NgModule } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    AuthModule.forRoot({
      domain: environment.logoutAuth0Domain,
      clientId: environment.auth0Client_id,
      audience: environment.auth0Audience,
      redirect_uri: environment.UIsiteURl
    })
  ],
  exports: [
    AuthModule
  ]

})

export class Auth0ModuleConfig { }