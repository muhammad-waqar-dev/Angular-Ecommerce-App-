import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-accounts-search',
  templateUrl: './accounts-search.component.html',
  styleUrls: ['./accounts-search.component.scss'],
})
export class AccountsSearchComponent implements OnInit, OnDestroy {
  searchOrderForm: UntypedFormGroup;
  @Output() searchAccountQuery: EventEmitter<any> = new EventEmitter();
  @Output() clearAccountSearch: EventEmitter<any> = new EventEmitter();
  @Input() isShowStatements;
  @Input() isShowYearFilter: boolean;
  accountSearchVal: any;
  accountSearchValReference: any;
  maxDate: any | null | NgbDate;
  minDate: any | null | NgbDate;
  toMindate: any | null | NgbDate;
  isDateSelected: boolean = false;
  accountSearchFromVal: {};
  accountSearchToVal: {};
  isMobile = CommonUtils.isMobile();
  constructor(
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.searchFormInitialize();
    if (!window.location.pathname.includes('my-accounts')) {
      this.shareEvents.accountSearchVal = '';
      this.shareEvents.accountSearchFromDate = '';
      this.shareEvents.accountSearchToDate = '';
      this.shareEvents.accountSearchValReference = '';
    }
    this.accountSearchVal = this.shareEvents.accountSearchVal;
    if (this.shareEvents.accountSearchFromDate !== undefined) {
      this.accountSearchFromVal = {
        day: parseInt(this.shareEvents.accountSearchFromDate?.day),
        month: parseInt(this.shareEvents.accountSearchFromDate?.month),
        year: this.shareEvents.accountSearchFromDate?.year,
      };
    } else {
      this.shareEvents.accountSearchFromDate = '';
    }
    if (this.shareEvents.accountSearchToDate !== undefined) {
      this.accountSearchToVal = {
        day: parseInt(this.shareEvents.accountSearchToDate?.day),
        month: parseInt(this.shareEvents.accountSearchToDate?.month),
        year: this.shareEvents.accountSearchToDate?.year,
      };
    } else {
      this.shareEvents.accountSearchToDate = '';
    }
    this.accountSearchValReference = this.shareEvents.accountSearchValReference;

  }

  searchFormInitialize() {
    this.searchOrderForm = this.fb.group({
      search: new UntypedFormControl(null),
      searchReference: new UntypedFormControl(null),
      validFrom: new UntypedFormControl(null),
      validTo: new UntypedFormControl(null),
    });

    if (this.shareEvents.accountSearchFromDate == undefined && this.shareEvents.accountSearchToDate == undefined) {
      this.initialMinMax();
    }
  }

  initialMinMax() {
    this.minDate = {
      day: this.calendar.getToday().day,
      month: this.calendar.getToday().month,
      year: this.calendar.getToday().year - 2,
    };
    this.maxDate = {
      day: this.calendar.getToday().day,
      month: this.calendar.getToday().month,
      year: this.calendar.getToday().year,
    };
  }

  submit() {
   
    if (
      !this.isDateSelected &&
      (this.searchOrderForm.controls.search.value.length > 0 ||
        this.searchOrderForm.controls.searchReference.value.length > 0)
    ) {
      let searchValue = '';
      let isReference = false;
      if (
        this.searchOrderForm.controls.searchReference.value &&
        this.searchOrderForm.controls.searchReference.value.length &&
        this.shareEvents.accountSearchValReference == ''
      ) {
        //for refererence number search
        isReference = true;
        searchValue = this.searchOrderForm.controls.searchReference.value;
        this.shareEvents.accountSearchValReference =
          this.searchOrderForm.controls.searchReference.value;
        this.shareEvents.accountSearchVal = '';
        this.shareEvents.accountSearchFromDate = '';
        this.shareEvents.accountSearchToDate = '';
      } else {
        //for doc number search
        searchValue = this.searchOrderForm.controls.search.value;
        this.shareEvents.accountSearchVal =
          this.searchOrderForm.controls.search.value;
        this.shareEvents.accountSearchValReference = '';
        this.shareEvents.accountSearchFromDate = '';
        this.shareEvents.accountSearchToDate = '';
      }

      this.searchAccountQuery.emit({
        searchValue: searchValue,
        isDate: false,
        isReference: isReference,
      });
      if (this.isMobile) {
        this.shareEvents.mobileAccountSearchSendEvent({
          searchValue: searchValue,
          isDate: false,
          isReference: isReference,
        });
      }
    } else if (this.isDateSelected) {
      this.shareEvents.accountSearchVal = '';
      this.shareEvents.accountSearchValReference = '';
      this.searchAccountQuery.emit({
        searchValue: { minDate: this.minDate, maxDate: this.maxDate },
        isDate: true,
      });
      if (this.isMobile) {
        this.shareEvents.mobileAccountSearchSendEvent({
          searchValue: { minDate: this.minDate, maxDate: this.maxDate },
          isDate: true,
        });
      }
    }
  }

  resetSearch() {
    this.searchOrderForm.controls.search.setValue('');
    this.shareEvents.accountSearchVal = '';
    this.shareEvents.accountSearchValReference = '';
    this.searchOrderForm.controls.validFrom.setValue('');
    this.searchOrderForm.controls.validTo.setValue('');
    this.searchFormInitialize();
    this.clearAccountSearch.emit(true);
    if (this.isMobile) {
      this.shareEvents.mobileAccountResetSendEvent();
    }
  }

  ngOnDestroy(): void {}

  onDateSelectFrom(r) {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 300);
    this.isDateSelected = true;

    this.minDate = {
      day: r.day,
      month: r.month,
      year: r.year,
    };
    this.shareEvents.accountSearchFromDate = JSON.parse(JSON.stringify(r));
  }
  onDateSelectTo(r) {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 300);
    this.isDateSelected = true;
    this.maxDate = {
      day: r.day,
      month: r.month,
      year: r.year,
    };

    this.shareEvents.accountSearchToDate = JSON.parse(JSON.stringify(r));
  }

  orderFromDate(dateValue) {
    this.toMindate = {
      day: dateValue.day,
      month: dateValue.month,
      year: dateValue.year,
    };
    this.shareEvents.accountSearchFromDate = JSON.parse(
      JSON.stringify(dateValue)
    );
  }
}
