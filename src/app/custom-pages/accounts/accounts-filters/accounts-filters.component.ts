import { Component, Input, OnChanges, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'accounts-filters',
  templateUrl: './accounts-filters.component.html',
  styleUrls: ['./accounts-filters.component.scss']
})
export class AccountsFiltersComponent implements OnChanges, OnInit {

  @Input() filtersModel;
  @Input() filtersState;
  @Input() isHistoricData;
  @Output() filterSelected: EventEmitter<any> = new EventEmitter();
  @Output() showStatements: EventEmitter<any> = new EventEmitter();
  @Output() clearMobileFilters: EventEmitter<any> = new EventEmitter();
  @Output() sendFilterModel: EventEmitter<any> = new EventEmitter();
  @Output() sendLastSelectedFilter: EventEmitter<any> = new EventEmitter();
  filtersModelData: any;
  isMobile = CommonUtils.isMobile();
  SortPipe = SortPipe;

  constructor(private modalService: NgbModal, public accountService: AccountsService,
    private shareEvents: ShareEvents,
    private cdr: ChangeDetectorRef) {
     }
  filtersCategoryState = [];
  ngOnChanges(): void {
    debugger;
    this.filtersModelData = this.filtersModel;
    this.initFilterNames();
  }
  ngOnInit(): void {
    this.filtersModelData = this.filtersModel;
    
  }
  toggleFilterItems(i, catName) {
    this.clearSearchonFilterClick();
    this.filtersCategoryState[catName] = !this.filtersCategoryState[catName];
  }
  selectFilter(filterIndex, valueIndex, filter, value, callFrom) {
    // this.filtersModel?.forEach(element => {
    //   element?.values?.forEach(ele => {
    //     ele.selected = false;
    //   });
    // });
    if(callFrom != 'Statements') {
    if (value && value?.code) {
      value.code = value.code?.toUpperCase();
      this.accountService.isShowStatements = (value.code?.toUpperCase() === 'statements') ? true : false;
    }

    this.clearSearchonFilterClick();
    //this.filtersModel[filterIndex].values[valueIndex].selected = !this.filtersModel[filterIndex].values[valueIndex].selected


    // this.showStatements?.emit(false);
    this.filterSelected.emit({ filter: filter, value: value, selected: !value.selected });
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.sendFilterModel.emit(this.filtersModel)
    this.sendLastSelectedFilter.emit(value.code)
    }

    if(callFrom == 'Statements') {
      if(this.isHistoricData) {
        this.filtersModel[filterIndex].values[valueIndex].selected = true;
        this.sendFilterModel.emit(this.filtersModel);
      }
      this.sendLastSelectedFilter.emit(value.code)
      this.accountService.isShowStatements = true;
      this.showStatements.emit(value);
    }
  }
  clearSearchonFilterClick() {
    this.accountService.CustomerReferenceNumber = "";
    this.accountService.documentNumber = "";
    this.accountService.dateEnd = '';
    this.accountService.dateStart = '';

    this.shareEvents.accountSearchVal = '';
    this.shareEvents.accountSearchFromDate = '';
    this.shareEvents.accountSearchToDate = '';
    this.shareEvents.accountSearchValReference = '';
  }
  resetAndCloseForm() {
    this.modalService.dismissAll();
  }

  statementsSelected() {
    this.accountService.isShowStatements = true;
    this.filtersModel.forEach(element => {
      element.values.forEach(e => {
        e.selected = false;
      });
    });
    this.showStatements.emit(true);
  }

  initFilterNames() {

    this.filtersModel[0].values.forEach(element => {
      if (element.code === 'INVOICE') {
        element.name = 'Invoices'
      }
      else if (element.code === 'CREDITMEMO') {
        element.name = 'Credit Notes'
      }
      else if (element.code === 'DEBITMEMO') {
        element.name = 'Debit Notes'
      }
      else if (element.code === 'OTHER') {
        element.name = 'Rebates'
      }


    });
    this.filtersModel[1].values.forEach(element => {
      if (element.code === 'OVERDUE') {
        element.name = 'Overdue'
      }
      else if (element.code === 'OUTSTANDING') {
        element.name = 'Outstanding'
      }
      else if (element.code === 'PAID') {
        element.name = 'Paid'
      }
      else if (element.code === 'REBATES') {
        element.name = 'Rebates'
      }
      else if (element.code === 'DISPUTED') {
        element.name = 'Disputed'
      }

    });

    let statementAdded = false;
    this.filtersModel[0].values.forEach(element => {
      if (element.code === 'Statements') {
        statementAdded = true;
      }
    });

    if (!statementAdded) {
      this.filtersModel[0].values.push({
        code: "Statements",
        name: "Statements",
        position: "5",
        selected: false
      })
    }

  }
  clearFilters() {
    this.clearMobileFilters.emit(true)

  }
}
