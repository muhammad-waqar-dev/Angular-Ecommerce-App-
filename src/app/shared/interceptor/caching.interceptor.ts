import { Injectable, NgZone } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CacheService } from '../services/cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>(); // Map to store cached responses
  private internalStaffCount = 0;

  constructor(private ngZone: NgZone, private cacheSerivce: CacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      // Pass non-GET requests through
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.urlWithParams);

    if (cachedResponse && !this.cacheSerivce.getIsUpdated() && !this.cacheSerivce.getInternalStaff()) { // && (Date.now() - cachedResponse['cachedTime'] < this.cacheTime)) {
      // Return cached response
      return of(new HttpResponse({ body: cachedResponse }));
    } else {

      if (req?.url?.indexOf('current/carts') > 0 && this.cacheSerivce.getInternalStaff() && this.internalStaffCount <= 1) {
        this.internalStaffCount++;
      } else if (this.internalStaffCount > 1) {
        this.cacheSerivce.setInternalStaff(false);
      }

      this.cacheSerivce.cartUpdateDone();
      this.cache.forEach((item: any, index: any) => {
        if (item.key == req.urlWithParams) {
          delete this.cache[index];
        }
      })
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Cache the response
          this.cache.set(req.urlWithParams, event.body);

          // Trigger change detection
          this.ngZone.run(() => {
            // Your code to trigger change detection here
          });
        }
      })
    );
  }
}
