import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-order-deliveries-search',
  templateUrl: './order-deliveries-search.component.html',
  styleUrls: ['./order-deliveries-search.component.scss']
})
export class OrderDeliveriesSearchComponent implements OnInit, OnDestroy {
  searchOrderForm: UntypedFormGroup;
  @Output() searchOrderQuery: EventEmitter<any> = new EventEmitter();
  @Output() clearOrderSearch: EventEmitter<any> = new EventEmitter();
  orderSearchVal: any;
  maxDate: any | null | NgbDate;
  minDate: any | null | NgbDate;
  toMindate: any | null | NgbDate;
  isDateSelected: boolean = false;
  orderSearchFromVal: {};
  orderSearchToVal: {};
  isMobile = CommonUtils.isMobile();
  constructor(
    private fb: UntypedFormBuilder,
    private shareEvents: ShareEvents,
    private calendar: NgbCalendar
    ) { }

  ngOnInit(): void {

    this.searchFormInitialize();
    if(!(window.location.pathname.includes('my-orders-deliveries'))) {
      this.shareEvents.orderSearchVal = '';
      this.shareEvents.orderSearchFromDate = '';
      this.shareEvents.orderSearchToDate = '';
    }

    if (this.shareEvents.orderSearchFromDate !== undefined) {
      this.orderSearchFromVal = {
        day: parseInt(this.shareEvents.orderSearchFromDate?.day),
        month: parseInt(this.shareEvents.orderSearchFromDate?.month),
        year: this.shareEvents.orderSearchFromDate?.year,
      };
    } else {
      this.shareEvents.orderSearchFromDate = '';
    }


    if (this.shareEvents.orderSearchToDate !== undefined) {
      this.orderSearchToVal = {
        day: parseInt(this.shareEvents.orderSearchToDate?.day),
        month: parseInt(this.shareEvents.orderSearchToDate?.month),
        year: this.shareEvents.orderSearchToDate?.year,
      };
    } else {
      this.shareEvents.orderSearchToDate = '';
    }

    this.searchOrderForm.controls.search.setValue( this.shareEvents.orderSearchVal);
    this.searchOrderForm.controls.validFrom.setValue( this.shareEvents.orderSearchFromDate);
    this.searchOrderForm.controls.validTo.setValue( this.shareEvents.orderSearchToDate);
  }

  searchFormInitialize() {
    this.searchOrderForm = this.fb.group(
      {
        search: new UntypedFormControl(null),
        validFrom: new UntypedFormControl(null),
        validTo: new UntypedFormControl(null)
      }
    );
    if (this.shareEvents.orderSearchFromDate == undefined && this.shareEvents.orderSearchToDate == undefined) {
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
       if(!this.isDateSelected && this.searchOrderForm.controls.search.value.length > 0){
         this.shareEvents.orderSearchVal = this.searchOrderForm.controls.search.value;
        this.searchOrderQuery.emit({searchValue: this.searchOrderForm.controls.search.value, isDate: false });
       }
       else if(this.isDateSelected){
        this.searchOrderQuery.emit({searchValue: {minDate: this.minDate, maxDate: this.maxDate}, isDate: true });
        this.initialMinMax();
      }
  }

  resetSearch(){
    this.searchOrderForm.controls.search.setValue('');
    this.shareEvents.orderSearchVal = '';
    this.searchOrderForm.controls.validFrom.setValue('');
    this.searchOrderForm.controls.validTo.setValue('');
    this.searchFormInitialize();
    this.clearOrderSearch.emit(true);
  }

  ngOnDestroy(): void {
    if(!(window.location.pathname.includes('my-orders-deliveries')) && !this.isMobile) {
      this.shareEvents.orderSearchVal = '';
      this.shareEvents.orderSearchFromDate = '';
      this.shareEvents.orderSearchToDate = '';
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
      this.shareEvents.orderSearchToDate = JSON.parse(JSON.stringify(r));
  }

  orderFromDate(dateValue) {
    this.toMindate = {
      day: dateValue.day,
      month: dateValue.month,
      year: dateValue.year,
    }
    this.shareEvents.orderSearchFromDate = JSON.parse(JSON.stringify(dateValue));
  }

}
