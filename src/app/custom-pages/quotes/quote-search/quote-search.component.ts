import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { QuoteService } from 'src/app/shared/services/quote.service';

@Component({
  selector: 'app-quote-search',
  templateUrl: './quote-search.component.html',
  styleUrls: ['./quote-search.component.scss']
})
export class QuoteSearchComponent implements OnInit, OnDestroy {
  quotesOrderForm: UntypedFormGroup;
  @Output() searchQuoteQuery: EventEmitter<any> = new EventEmitter();
  @Output() clearQuoteSearch: EventEmitter<any> = new EventEmitter();
  quoteSearchVal: any;
  quoteSearchFromVal: {};
  quoteSearchToVal: {};
  maxDate: any | null | NgbDate;
  minDate: any | null | NgbDate;
  toMindate: any | null | NgbDate;
  isDateSelected: boolean = false;
  isMobile = CommonUtils.isMobile();
  constructor(
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private quoteService: QuoteService,
    private calendar: NgbCalendar
    ) { }

  ngOnInit(): void {
    this.quotesFormInitialization()
    if(!(window.location.pathname.includes('my-quotes'))) {
      this.shareEvents.quoteSearchVal = '';
      this.shareEvents.quoteSearchFromDate = '';
      this.shareEvents.quoteSearchToDate = '';
    }


    if (this.shareEvents.quoteSearchFromDate !== undefined) {
      this.quoteSearchFromVal = {
        day: parseInt(this.shareEvents.quoteSearchFromDate?.day),
        month: parseInt(this.shareEvents.quoteSearchFromDate?.month),
        year: this.shareEvents.quoteSearchFromDate?.year,
      };
    } else {
      this.shareEvents.quoteSearchFromDate = '';
    }


    if (this.shareEvents.quoteSearchToDate !== undefined) {
      this.quoteSearchToVal = {
        day: parseInt(this.shareEvents.quoteSearchToDate?.day),
        month: parseInt(this.shareEvents.quoteSearchToDate?.month),
        year: this.shareEvents.quoteSearchToDate?.year,
      };
    } else {
      this.shareEvents.quoteSearchToDate = '';
    }
    this.quotesOrderForm.controls.search.setValue( this.shareEvents.quoteSearchVal);
  }

  quotesFormInitialization() {
    this.quotesOrderForm = this.fb.group(
      {
        search: new UntypedFormControl(null),
        validFrom: new UntypedFormControl(null),
        validTo: new UntypedFormControl(null)
      }
    );
    if (this.shareEvents.quoteSearchFromDate == undefined && this.shareEvents.quoteSearchToDate == undefined) {
      this.initialMinMax();
    }  
  }

initialMinMax() {
  this.minDate = {
    day:this.calendar.getToday().day,
    month: this.calendar.getToday().month,
    year: this.calendar.getToday().year - 1,
  }
  this.maxDate = {
    day:this.calendar.getToday().day,
    month: this.calendar.getToday().month,
    year: this.calendar.getToday().year,
  }
}
  submit() {
    // this.searchQuoteQuery.emit(this.quotesOrderForm.controls.search.value);
    this.shareEvents.quoteSearchVal = this.quotesOrderForm.controls.search.value;
    if(!this.isDateSelected && this.quotesOrderForm.controls.search.value.length > 0){
      this.searchQuoteQuery.emit({searchValue: this.quotesOrderForm.controls.search.value, isDate: false });
     }
     else if(this.isDateSelected){
      this.searchQuoteQuery.emit({searchValue: {minDate: this.minDate, maxDate: this.maxDate}, isDate: true });
     }
     this.initialMinMax();
  }

  resetSearch(){
    this.quotesOrderForm.controls.search.setValue('');
    this.shareEvents.quoteSearchVal = '';
    this.shareEvents.quoteSearchFromDate = '';
    this.shareEvents.quoteSearchToDate = '';
    this.quotesOrderForm.controls.validFrom.setValue('');
    this.quotesOrderForm.controls.validTo.setValue('');
    this.quotesFormInitialization();
    this.clearQuoteSearch.emit(true);
  }

  ngOnDestroy(): void {
    if(!(window.location.pathname.includes('my-quotes')) && !this.isMobile) {
      this.shareEvents.quoteSearchVal = '';
      this.shareEvents.quoteSearchFromDate = '';
      this.shareEvents.quoteSearchToDate = '';
      this.resetSearch();
    }
  }

  onDateSelectFrom(r) {
    setTimeout(() => {
      window.scroll(0,0)
      }, 300) 
      this.isDateSelected = true;

      this.minDate = {
        day:r.day,
        month: r.month,
        year: r.year
      }

  }
  onDateSelectTo(r) {
    setTimeout(() => {
      window.scroll(0,0)
      }, 300) 
      this.isDateSelected = true;
      this.maxDate = {
        day:r.day,
        month: r.month,
        year: r.year
      }
      this.shareEvents.quoteSearchToDate = JSON.parse(JSON.stringify(r));
  }

  quoteFromDate(dateValue) {
    this.toMindate = {
      day: dateValue.day,
      month: dateValue.month,
      year: dateValue.year,
    }
    this.shareEvents.quoteSearchFromDate = JSON.parse(JSON.stringify(dateValue));
    
  }

}
