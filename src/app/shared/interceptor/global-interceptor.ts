import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { NEVER, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { LogoutService } from 'src/app/core/service/logout.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  accessToken: any;
  idToken: string = null;
  accessValue: any;
  idValue = [];
  emailValue: any;
  currentTime: any;
  constructor(@Inject(DOCUMENT) private doc: Document, private http: HttpClient,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private oAuthService: OAuthService,
    private auth: AuthService,
    private authService: AuthService,
    private logoutService: LogoutService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (sessionStorage.getItem('orderConfirm') == "true" && !request.url.includes('pageType=ContentPage')) {
      sessionStorage.removeItem('orderConfirm')
      window.location.reload();
    }
    // Session expired check the URL and Clear local storage
    if (request.url.includes('/logout')) {
      this.clearSession();
    } else if (request.url.includes('not-found')) {
      return next.handle(request).pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403 || err.status === 401) {
              // Invalidate user session and redirect to login/home
              if (sessionStorage.getItem('internalUserState') == 'false') {
                this.logoutService.logoutRevoke().subscribe(() => {
                  this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
                })
              } else {
                this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
                sessionStorage.clear();
                localStorage.clear();
                const newRequest = request.clone({
                  setHeaders: {
                    fbLogin: 'auth0',
                  },
                });
                return next.handle(newRequest);
              }
            }
          }
        })
      );
    }

    //here comes the condition for internal staff
    let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));

    if (sessionStorage.getItem('internalUserState') == 'false' && sessionStorage.getItem('fbCSRTradeAcc') && auth0AccessToken?.userId == "current") {
      const newRequest = request.clone({
        setHeaders: {
          fbCSRToken: sessionStorage.getItem('fbCSRToken'), //get from common service
          fbCSRTradeAcc: sessionStorage.getItem('fbCSRTradeAcc') //user account number from session storage
        },
      });
      return this.handleMultipleCartsRequest(request, newRequest, next);
    }

    if (!request.url.includes('/oauth/token') && !request.url.includes('/logout')
      && !request.url.includes('/api.npms') && !request.url.includes('createAccount')
      && sessionStorage.getItem('internalUserState') !== 'false') {
      const newRequest = request.clone({
        setHeaders: {
          fbLogin: 'auth0',
        },
      });
      return this.handleMultipleCartsRequest(request, newRequest, next);
    }

    if (!request.url.includes('/oauth/token') && !request.url.includes('/logout')
      && !request.url.includes('/api.npms') && !request.url.includes('createAccount')
      && sessionStorage.getItem('internalUserState') !== 'false' && !request.url.includes('resetpassword')) {
      const newRequest = request.clone({
        setHeaders: {
          fbLogin: 'auth0',
        },
      });
      return this.handleMultipleCartsRequest(request, newRequest, next);
    }
    else {
      const newRequest = request.clone({
        setHeaders: {},
      });
      return this.handleMultipleCartsRequest(request, newRequest, next);
    }

  }

  handleMultipleCartsRequest(request: any, newRequest: any, next: any): any {
    if (request?.url?.includes('consenttemplates')  || request?.url?.includes('NRJS')) {
      return NEVER;
    } else {
      return next.handle(newRequest);
    }
  }

  clearSession(): void {
    this.logoutService.logoutRevoke().subscribe((res) => {
      this.auth.logout({ returnTo: environment?.UIsiteURl + '/login' });
      sessionStorage.clear();
      localStorage.clear();
    })
  }
}