import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AuthService, RoutingService } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'fib2b';
  private subscription = new Subscription();
  isLoggedIn: Observable<boolean>;
  
  constructor(private router: Router, private routingService: RoutingService,
    private authService: AuthService) {
      this.isLoggedIn =   this.authService?.isUserLoggedIn();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
