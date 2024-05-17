import { NgModule } from '@angular/core';
import { AuthConfig, ConfigModule, provideConfig } from '@spartacus/core';
import { environment } from 'src/environments/environment';

let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
let responseVal;
let configVal: any;
let showLogin = false;

if(window.location.pathname.includes('pw')) {
  sessionStorage.setItem("internalUserState", "false");
}


if(!window.location.pathname.endsWith('fi-spa') && !window.location.pathname.endsWith('forgot-password') 
&& sessionStorage.getItem('internalUserState') == 'false' && !window.location.pathname.endsWith('login') &&
auth0AccessToken?.userId !== "current" && !window.location.pathname.includes('pw') ) {
 // alert("came one")
 sessionStorage.clear();
}


if(!window.location.pathname.includes('internalStaff') 
    //uncomment for maintenance page - start
// && !(window.location.pathname.includes('login')) 
    //uncomment for maintenance page - end
&& !(window.location.pathname.includes('/create-account')) 
&& sessionStorage.getItem('internalUserState') !== 'false' && !window.location.pathname.includes('pw')) {
 // alert("came two")
 
if (auth0AccessToken?.userId !== "current" && !(window.location.pathname.includes('/create-account'))) {
  responseVal = 'code'
  if (!(window.location.href.includes('code=')) ) {
    //comment for maintenance page - start
    //window.location.href = environment.UIsiteURl + "/login";
    //comment for maintenance page - end
    showLogin = true
  }
}
else {
  responseVal = ''
}

configVal = provideConfig(<AuthConfig>{
  authentication: {
    OAuthLibConfig: {
      responseType: responseVal,
      redirectUri: environment.UIsiteURl,
      disablePKCE: false,
      useHttpBasicAuth: true,
      scope: 'openid profile email',
      useIdTokenHintForSilentRefresh: true,
      customQueryParams: {
        audience: environment.auth0Audience,
        response_mode: 'query'
      }
    },
    baseUrl: environment.auth0Domain,
    client_id: environment.auth0Client_id,
    client_secret: environment.auth0Client_secret,
    tokenEndpoint: '/oauth/token',
    revokeEndpoint: 'v2/logout',
    userinfoEndpoint: '/userinfo',
    loginUrl: '/authorize',
  }
})
}else {
 // alert("came three")
  if (auth0AccessToken?.userId !== "current" && !(window.location.pathname.includes('/create-account'))) {
    localStorage.clear();
  }
  configVal = provideConfig(<AuthConfig>{
  })
}



@NgModule({
  imports: [
    ConfigModule.withConfig({
      routing:{
        protected: showLogin
      }
    })
  ],
  exports: [],
  providers: [
    configVal,
  ]

})

export class SpartacusAuth0ModuleConfig { }