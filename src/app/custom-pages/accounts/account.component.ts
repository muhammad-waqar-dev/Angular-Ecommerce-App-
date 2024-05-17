import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewConfig } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';
import {
  genericConstants,
  accountConstants,
} from 'src/app/core/constants/general';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PayInvoicePopupComponent } from './accounts-details/pay-invoice-popup/pay-invoice-popup.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() navigateOrder;
  constructor(
    private modalService: NgbModal,
    private shareEvents: ShareEvents,
    scrollConfig: ViewConfig,
    public accountService: AccountsService,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.shareEvents.resetGlobalSearchSendEvent();
  }

  genericConstants = genericConstants;
  accountConstants = accountConstants;
  divContent = true;
  showFilterSection: boolean = true;
  isGridView: boolean = true;
  isSelectAll: boolean = true;
  accountSummaryData: any;
  isMobile = CommonUtils.isMobile();
  isInfiniteScroll: boolean = this.isMobile;
  modalRef: any;
  isLoading$ = new BehaviorSubject<boolean>(true);
  permissionAllowed: boolean = true;
  ErrorMsgText: string;

  isSortingInit: boolean = false;

  filtersModel: any = [];
  lastSelectedFilterValue: any;
  filtersState = [[]];
  accounts = [];
  statements = [];
  isLoded: boolean = false;

  pageSize: number = 12;
  paginationModel = {
    currentPage: 0,
    pageSize: this.pageSize,
    sort: '',
    totalPages: 3,
    totalResults: 10,
  };

  sortOption = [];
  selectedSortName: any = {
    code: 'date',
    name: 'Document Date',
    selected: true,
  };
  currentDate = '';
  historyDate = '';
  isHistoricData: boolean = false;

  listViewHeading = [
    {
      name: '',
      id: 'checkbox-container',
    },
    {
      name: ' Billing No',
      id: 'invoiceNo',
    },
    {
      name: 'Status',
      id: 'status',
    },
    {
      name: 'Your Reference No',
      id: 'invoiceDate',
    },
    {
      name: 'Document Date',
      id: 'createdDate',
    },
    {
      name: 'Document Amount',
      id: 'amount',
    },
  ];
  listViewHeadingNonRebates = [
    {
      name: '',
      id: 'checkbox-container',
    },
    {
      name: ' Billing No',
      id: 'invoiceNo',
    },
    {
      name: 'Status',
      id: 'status',
    },
    {
      name: 'Your Reference No',
      id: 'invoiceDate',
    },
    {
      name: 'Document Date',
      id: 'createdDate',
    },
    {
      name: 'Document Amount',
      id: 'amount',
    },
  ];
  listViewHeadingForRebates = [
    {
      name: '',
      id: 'checkbox-container',
    },
    {
      name: ' Billing No',
      id: 'invoiceNo',
    },
    {
      name: 'Status',
      id: 'status',
    },
    {
      name: 'Document Date',
      id: 'createdDate',
    },
    {
      name: 'Document Amount',
      id: 'amount',
    },
  ];

  listViewStatementHeading = [
    {
      name: 'Statement For',
      id: 'statement-for',
    },
    {
      name: ' Statement Balance',
      id: 'statement-balance',
    },
  ];

  public isPaginationModel$ = new BehaviorSubject<boolean>(true);

  showDetailsPage: boolean = false;
  accountDetails: any = {};
  isAccountDetails: boolean = false;

  months: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      event: 'Page-Details', //constant value
      currentURL: window.location.href, // page url
      currentPageTitle: 'My Accounts', // enter if exists
      pageType: 'My Accounts',
      isLoggedIn: 'Yes',
    });
    this.shareEvents.mobileAccountSearchReceiveEvent().subscribe((data) => {
      this.onAccountSearchQuery(data);
    });

    this.shareEvents.mobileAccountResetReceiveEvent().subscribe(() => {
      this.onAccountClearSearch();
    });

    this.emptyServiceState();

    this.clearSearchFields();
    if (this.isMobile) {
      this.listViewHeading = [];
      this.listViewHeading = [
        {
          name: '',
          id: 'checkbox-container',
        },
        {
          name: 'Billing No',
          id: 'invoiceNo',
        },
        {
          name: 'Status',
          id: 'status',
        },
        {
          name: 'Document Amount',
          id: 'amount',
        },
      ];
    }

    this.filtersModel = [
      {
        name: 'Document Type',
        values: [
          {
            code: 'Invoices',
            name: 'Invoices',
            position: '0',
            selected: true,
          },
          {
            code: 'Credit Notes',
            name: 'Credit Notes',
            position: '1',
            selected: false,
          },
          {
            code: 'Debit Notes',
            name: 'Debit Notes',
            position: '2',
            selected: false,
          },
          {
            code: 'Rebates',
            name: 'Rebates',
            position: '2',
            selected: false,
          },
          {
            code: 'Statements',
            name: 'Statements',
            position: '2',
            selected: false,
          },
        ],
      },
      {
        name: 'others',
        values: [
          {
            code: 'Overdue',
            name: 'Overdue',
            position: '0',
            selected: true,
          },
          {
            code: 'Disputed',
            name: 'Disputed',
            position: '0',
            selected: true,
          },
          {
            code: 'Outstanding',
            name: 'Outstanding',
            position: '0',
            selected: true,
          },
          {
            code: 'Paid',
            name: 'Paid',
            position: '0',
            selected: false,
          },
        ],
      },
    ];

    this.accounts.forEach((a) => {
      a.selected = false;
    });

    this.getAccounts();

    if(!this.isHistoricData) {
      this.getStatements();
    }

    // subscribing the centralized observable - either orders details page boolean is true/false
    this.shareEvents.isAccountDetails.subscribe((res: any) => {
      this.isAccountDetails = res;
    });
    this.isAccountDetails = false;

    var currentYear: Date = new Date();
    this.currentDate = currentYear.getFullYear().toString() + '-' + (currentYear.getFullYear() - 1).toString();
    this.historyDate = (currentYear.getFullYear() - 2).toString() + '-' + (currentYear.getFullYear() - 5).toString();
  }

  getHistoryDate(): any {
    const currentYear: Date = new Date();
    return this.months[currentYear.getMonth()] + ' ' + currentYear.getFullYear();
  }

  getAccounts(selectedFilter?) {
    debugger;
    this.isPaginationModel$.next(false);
    if (!this.isMobile) {
      this.isLoading$.next(true);
    }

    if(this.isHistoricData) {
      if(selectedFilter?.name == 'Statements'){
          this.accountService.filters = 'Statements';
      }
    }
    
    this.accountService
      .getAccountData(this.paginationModel.currentPage ? this.paginationModel.currentPage : 0, this.pageSize, this.isHistoricData)
      .subscribe(
        (data: any) => {
          this.accounts = data?.orders;
          debugger;
          const accountResult = data?.results?.value;
          if (this.isHistoricData) {
            this.accountSummaryData = JSON.parse(accountResult);
            this.accounts = this.accountSummaryData?.resultList;

            let resultPagintion = {
              currentPage: this.accountSummaryData?.currentPage - 1,
              pageSize: this.accountSummaryData?.pageSize,
              sort: '',
              totalPages: this.accountSummaryData?.totalPages,
              totalResults: this.accountSummaryData?.totalRecords,
            }
            this.paginationModel = resultPagintion;
            if(this.isHistoricData) {
              if(selectedFilter?.code == 'Statements') {
              data?.filters[0]?.values?.push(
                {code: "Statements", name: "Statements", position: "5", selected: false}
              );
              data?.filters[0]?.values?.forEach(ele => {
                if(ele.code != 'Statements') {
                    ele.selected = false;
                } else {
                  ele.selected = true;
                  this.accountService.isShowStatements = true;
            }
              })
              }
            }
            if (this.accounts?.length > 0 && this.accounts[0]?.journalEntryType === "STAT") {
              this.statements = this.accounts;
              this.cdr.detectChanges();
              this.cdr.markForCheck();
            }
          }
          else {
            this.accountSummaryData = JSON.parse(accountResult)?.d?.results;
            this.accounts = this.accountSummaryData;
            this.accountDetails = this.accountSummaryData;
            this.paginationModel = data?.pagination;
            this.setPagination(data);
          }

          this.isLoading$.next(false);
          this.setSortOptionData();

          if (this.accounts?.length > 0 || this.statements?.length > 0 || !this.isLoded) {
            this.filtersModel = [];
            this.filtersModel = data?.filters;
          }
          this.isLoded = true;
          this.cdr.detectChanges();
          this.cdr.markForCheck();
        },
        (error) => {
          if (error.status == 403) {
            this.permissionAllowed = false;
          } else {
            this.ErrorMsgText = error.error.errors[0].message;
          }
          this.isLoading$.next(false);
        }
      );
  }

  getStatements() {
    this.statements = [];
    this.accountService.statementsData().subscribe(
      (data) => {
        //this.statements = data?.statements;

        this.statements = data?.d?.results
        this.statements?.sort(function (a, b) {
          return (
            new Date(a.closingDate)?.valueOf() -
            new Date(b.closingDate)?.valueOf()
          );
        });

        for (let i = 0; i < this.statements?.length; i++) {
          if (
            this.statements[i].closingDate !== null &&
            this.statements[i].closingDate !== undefined
          ) {
            let closingDateVal = new Date(this.statements[i]?.closingDate);
            this.statements[i].closingDate = this.datepipe?.transform(
              closingDateVal,
              'dd MMM yy'
            );
          }
        }
      });
  }

  setPagination(data) {
    this.paginationModel.currentPage = data?.pagination?.page;
    this.paginationModel.totalResults = data?.pagination?.totalCount;
    this.paginationModel.pageSize = data?.pagination?.count;
    this.paginationModel.totalPages = data?.pagination?.totalPages;
  }

  setSortOptionData() {
    this.sortOption = [
      {
        code: 'Document Date',
        name: 'Document Date',
        selected: true,
      },
    ];
  }

  toggleDivContent() {
    this.divContent = !this.divContent;
    this.showFilterSection = !this.showFilterSection;
  }
  openFiltersPopup(content) {
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }

  initializeFilterState() {
    this.filtersModel.forEach((n, m) => {
      this.filtersState[m] = [];
      n.values.forEach((e, o) => {
        this.filtersState[m][o] = e.selected;
      });
    });
  }

  emptyServiceState() {
    this.accountService.isShowStatements = false;
    this.accountService.CustomerReferenceNumber = '';
    this.accountService.documentNumber = '';
    this.accountService.filters = '';
    this.accountService.searchBy = '';

    this.accountService.dateEnd = '';
    this.accountService.dateStart = '';
    this.accountService.sortOrderState = 'documentDate:ASC';
    this.accountService.filters = 'ALL';
    this.accountService.billingstatusFilter = 'ALL';
  }

  accountsPerPageSelectionChange(value) {
    this.pageSize = value;
    this.getAccounts();
    window.scroll(0, 0);
  }

  onFilterSelection($event) {
    debugger;
    this.paginationModel.currentPage = 0;

    if ($event?.filter?.code === 'DocumentTypeFilter') {
      //document type filter
      if (this.accountService.billingstatusFilter || this.lastSelectedFilterValue == 'Statements' ) {
        this.accountService.filters = $event.value.code;
      }

      if ($event.value.code === 'REBATE') {
        this.listViewHeading = [];
        this.listViewHeading = this.listViewHeadingForRebates;
      } else {
        this.listViewHeading = [];
        this.listViewHeading = this.listViewHeadingNonRebates;
      }
      // reseting the state to ALL when any Billing Status is selected (BUG-1172)
      this.accountService.billingstatusFilter = 'ALL';
    }

    //billing status filter
    else {
      this.accountService.billingstatusFilter = $event?.value?.code;
    }
    if(!this.isHistoricData && $event.name == "Statements") {
      this.getStatements()
    } else {
      this.getAccounts($event);
    }
  }
  pageChange(event) {
    this.paginationModel.currentPage = event;
    this.getAccounts();
    window.scroll(0, 0);
  }

  toggleGridView(e) {
    this.isGridView = e ? true : false;
  }

  changeSortOption(e) {
    this.selectedSortName = this.sortOption[e];
    this.sortOption.forEach((k) => {
      k.selected = false;
    });
    this.sortOption[e].selected = true;

    this.getAccounts();
  }

  onCardClick(data: any) {

    // if (!this.accountService.isShowStatements) {
    //   this.accountDetails = data;
    // } else {
    //   this.accountDetails = data;
    // }

    this.accountDetails = data;
    this.showDetailsPage = !this.showDetailsPage;

    this.shareEvents.setIsAccountDetails(this.showDetailsPage);
  }

  navigateBackAccount() {
    this.showDetailsPage = !this.showDetailsPage;
  }

  onAccountSearchQuery(e) {
    this.paginationModel.currentPage = 0;
    //other than date search
    if (!e.isDate) {
      if (e.isReference) {
        this.accountService.searchBy = 'CRN';
        this.accountService.CustomerReferenceNumber = e.searchValue;
        this.accountService.documentNumber = '';
      } else {
        this.accountService.searchBy = 'DN';
        this.accountService.documentNumber = e.searchValue;
        this.accountService.CustomerReferenceNumber = '';
      }
      this.accountService.dateEnd = '';
      this.accountService.dateStart = '';
      // DocNumber
    }

    //for date
    else {
      if (e.searchValue.minDate == undefined) {
        e.searchValue.minDate = this.shareEvents.accountSearchFromDate;
      }
      if (e.searchValue.maxDate == undefined) {
        e.searchValue.maxDate = this.shareEvents.accountSearchToDate;
      }
      if (e.searchValue.minDate.day < 10) {
        e.searchValue.minDate.day = '0' + e.searchValue.minDate.day;
      }
      if (e.searchValue.minDate.month < 10) {
        e.searchValue.minDate.month = '0' + e.searchValue.minDate.month;
      }

      if (e.searchValue.maxDate.day < 10) {
        e.searchValue.maxDate.day = '0' + e.searchValue.maxDate.day;
      }
      if (e.searchValue.maxDate.month < 10) {
        e.searchValue.maxDate.month = '0' + e.searchValue.maxDate.month;
      }
      let dateAfter =
        e.searchValue.minDate.year +
        '-' +
        e.searchValue.minDate.month +
        '-' +
        e.searchValue.minDate.day;
      let dateBefore =
        e.searchValue.maxDate.year +
        '-' +
        e.searchValue.maxDate.month +
        '-' +
        e.searchValue.maxDate.day;

      this.accountService.dateStart = dateAfter?.toString();
      this.accountService.dateEnd = dateBefore?.toString();
      this.accountService.CustomerReferenceNumber = '';
      this.accountService.documentNumber = '';
    }
    this.getAccounts();
  }

  onAccountClearSearch() {
    this.clearSearchFields();
    this.getAccounts();
    this.paginationModel.currentPage = 0;
  }
  clearSearchFields() {
    this.shareEvents.accountSearchVal = '';
    this.shareEvents.accountSearchValReference = '';
    this.shareEvents.accountSearchToDate = '';
    this.shareEvents.accountSearchFromDate = '';

    this.accountService.dateEnd = '';
    this.accountService.dateStart = '';
    this.accountService.CustomerReferenceNumber = '';
    this.accountService.documentNumber = '';
    this.accountService.searchBy = '';
  }

  changeSortOrder(e, code, i) {
    this.selectedSortName = this.sortOption[i];
    this.sortOption.forEach((k) => {
      k.selected = false;
    });
    this.sortOption[i].selected = true;
    let order: string;
    if (e === 'ASC') {
      order = 'DESC';
    } else {
      order = 'ASC';
    }
  }

  toggleAllSelection(s) {
    this.isSelectAll = s;

    this.accounts['billingDocs'].forEach((a) => {
      a.selected = s;
    });
  }

  paymentGraphLoad(e) {
    this.isLoading$.next(false);
  }

  makePayment() { }

  toggleStatements($event) {
    this.accountService.isShowStatements = $event;
  }

  resetFilters() {
    this.shareEvents.accountSearchVal = '';
    this.shareEvents.accountSearchValReference = '';
    this.shareEvents.accountSearchToDate = '';
    this.shareEvents.accountSearchFromDate = '';

    this.accountService.dateEnd = '';
    this.accountService.dateStart = '';
    this.accountService.CustomerReferenceNumber = '';
    this.accountService.documentNumber = '';
    this.accountService.searchBy = '';

    this.accountService.billingstatusFilter = 'ALL';
    this.accountService.filters = 'ALL';
    this.paginationModel.currentPage = 0;

    this.getAccounts();
  }

  handleDataSelection(param: boolean) {
    if(param) {
      this.filtersModel[0]?.values?.forEach((element) => {
        element.code == 'All' ? element.selected = true : element.selected = false;
      });
    }
    if(!param) {
      this.filtersModel?.forEach((element) => {
        element?.valies?.forEach(ele => {
          ele.code == 'All' ? ele.selected = true : ele.selected = false;
        });
      });
    }
    this.accountService.isShowStatements = false
    this.isHistoricData = param;
    this.accountService.filters = 'ALL';
    this.getAccounts()
  }

  sendBackFilter(event) {
    this.filtersModel = event;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  
  getLastSelectedFilter(event) {
    this.lastSelectedFilterValue = event;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}
