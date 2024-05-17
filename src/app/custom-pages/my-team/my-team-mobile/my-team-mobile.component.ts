import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';
import { ProductSearchPage } from '@spartacus/core';
import { ProductListComponentService, ViewConfig, ViewModes } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { MyTeamService } from 'src/app/shared/services/my-team.service';

@Component({
  selector: 'app-my-team-mobile',
  templateUrl: './my-team-mobile.component.html',
  styleUrls: ['./my-team-mobile.component.scss']
})
export class MyTeamMobileComponent {
  private subscription = new Subscription();

  @Input('scrollConfig')
  set setConfig(inputConfig: ViewConfig) {
    this.setComponentConfigurations(inputConfig);
  }

  model: any;
  @Input('model')

  @Input () sortOrder;
  @Input('users') users: any;
  set setModel(inputModel: any) {}

  viewMode: ViewModes;
  productLimit: number;
  maxProducts: number;

  ViewModes = ViewModes;
  appendProducts = false;
  resetList = false;
  isMaxProducts = false;
  isLastPage = false;
  isEmpty = false;

  constructor(
    private productListComponentService: ProductListComponentService,
    private ref: ChangeDetectorRef,
    private teamsService: MyTeamService
  ) {
  }
  scrollPage(pageNumber: number): void {
    this.appendProducts = true;
    this.ref.markForCheck();
    if (this.users.pagination.currentPage !== this.users.pagination.totalPages - 1) {
      this.teamsService.getUserData(this.users.pagination.currentPage + 1, this.users.pagination.pageSize, this.sortOrder.code, this.teamsService.permissionsQueryString).subscribe((data) => {
        this.users = {
          ...data,
          users: this.users.users.concat(data.users),
        }
      })
    }
  }

  private setComponentConfigurations(scrollConfig: ViewConfig): void {
    const isButton = scrollConfig.view?.infiniteScroll?.showMoreButton;
    const configProductLimit = scrollConfig.view?.infiniteScroll?.productLimit;

    //Display "show more" button every time when button configuration is true
    //Otherwise, only display "show more" when the configuration product limit is reached
    this.productLimit = isButton ? 1 : configProductLimit;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
