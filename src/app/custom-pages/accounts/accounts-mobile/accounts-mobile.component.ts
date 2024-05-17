import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ViewConfig, ViewModes } from '@spartacus/storefront';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-accounts-mobile',
  templateUrl: './accounts-mobile.component.html',
  styleUrls: ['./accounts-mobile.component.scss']
})
export class AccountsMobileComponent implements OnInit {


  @Input('scrollConfig') scrollConfig
  @Input() isGridView;
  @Input() showFilterSection;
  @Input() listViewHeading;
  @Input() listViewStatementHeading;
  @Input() navigateAccount;
  @Input()isShowStatements;
  @Input()statements;
  @Input() isHistoricData;
  
  set setConfig(inputConfig: ViewConfig) {
    this.setComponentConfigurations(inputConfig);
  }


  @Input('model') model: any;

  @Input() sortOrder;
  @Input() creditLimit;
  
  @Input('accounts') accounts: any;
  x: any;// = orders;
  set setModel(inputModel: any) { }


  viewMode: ViewModes;
  productLimit: number;
  maxProducts: number;
  appendProducts = false;
  resetList = false;
  isMaxProducts = false;
  isLastPage = false;
  isEmpty = false;

  showDetailsPage: boolean = false;
  accountDetails: any = {};
  
  constructor(private ref: ChangeDetectorRef, private accountService: AccountsService, private shareEvents: ShareEvents) { }

  ngOnInit() {
    this.x = this.accounts;
  }

  private setComponentConfigurations(scrollConfig: ViewConfig): void {
    const isButton = scrollConfig.view?.infiniteScroll?.showMoreButton;
    const configProductLimit = scrollConfig.view?.infiniteScroll?.productLimit;

    //Display "show more" button every time when button configuration is true
    //Otherwise, only display "show more" when the configuration product limit is reached
    this.productLimit = isButton ? 1 : configProductLimit;
  }

  scrollPage(pageNumber: number): void {
    this.appendProducts = true;
    this.ref.markForCheck();
    if (this.model.currentPage !== this.model.totalPages - 1) {
      this.accountService.getAccountData(this.model.currentPage + 1, this.model.pageSize, this.isHistoricData).subscribe(data=> {
        
        let accountResult = data.results.value;

        let accountSummaryData = JSON.parse(accountResult);

        this.accounts = this.accounts.concat(accountSummaryData.billingDocs);
        this.model.currentPage = this.model.currentPage + 1;
      })
    }
  }

  // chaning showDetailsPage value as true to render detailsPageComponent
  onCardClick(data) {
    this.accountDetails = data;
    this.showDetailsPage = !this.showDetailsPage;

    // setting boolean state in centralized method - either orders details page boolean is true/false
    this.shareEvents.setIsAccountDetails(this.showDetailsPage);
  }

  navigateBackAccount() {
    this.shareEvents.setIsAccountDetails(false);
    this.showDetailsPage = !this.showDetailsPage;
  }

}
