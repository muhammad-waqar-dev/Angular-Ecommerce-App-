import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonUtils } from 'src/app/core/utils/utils';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountriesStatesService } from 'src/app/shared/services/countries-states.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';
import { DatePipe } from '@angular/common';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-order-delivery-section',
  templateUrl: './order-delivery-section.component.html',
  styleUrls: ['./order-delivery-section.component.scss']
})
export class OrderDeliverySectionComponent implements OnInit, OnDestroy {
  deliveryForm: UntypedFormGroup;
  nameCheck: boolean = false;
  @Output() onReviewClick = new EventEmitter();

  searchALL: string = 'delivery';
  paymentMethod: string = 'credit-account';

  selectedSortName: any = 'No Time Specified';
  selectedSortCode: any = 'NT';
  existingDeliveryOption = [];
  selectedExistingShipName: any = {};

  // state drowdown properties 
  stateOption: any = [];
  selectedStateName: any = 'State';

  // country drowdown properties 
  countryOption$: any = [];
  selectedCountryName: any = 'Country';
  countryList = new BehaviorSubject<any>('');
  stateList = new BehaviorSubject<any>('');

  reqDelDate: any;
  reqDeliveryTime: any;
  selectedAddressId: any;
  isLoading$ = new BehaviorSubject<boolean>(true);
  private subscription = new Subscription();
  reqDateErrorMSG= new BehaviorSubject<any>('');
  reqErrorValid: boolean = false;
  isReviewOrder: boolean = false;
  isPayForYourOrder: boolean = false;
  isOrderSummaryExpanded: boolean = false;
  isFulfilment: boolean = false;
  isMobile: boolean = false;
  isNewAddress: boolean = false;
  isDataPopulated: boolean = true;
  selectRegionPlaceholder: boolean = false;

  minDate: any | null | NgbDate;
  isDisabled;
  model: NgbDateStruct;
  json = {
    disable: [6, 7]
  }

  constructor(private fb: UntypedFormBuilder, private calendar: NgbCalendar,
    private countriesStates: CountriesStatesService,
    private placeOrderService: PlaceOrderService,
    private datepipe: DatePipe,
    private shareEvents: ShareEvents,) {
    this.isDisabled = (
      date: NgbDateStruct
    ) => {
      return (this.json.disable.includes(calendar.getWeekday(new NgbDate(date.year, date.month, date.day)))
      ) ? true : false;
    };
  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.formInit();
    this.disableToggleInputs();
    this.shareEvents.receiveCartDate().subscribe((data) => {
      this.submit();
    });
  }

  formInit() {
    this.deliveryForm = this.fb.group({
      poNumber: new UntypedFormControl('', [Validators.required]),
      requestedDeliveryDate: new UntypedFormControl('', [Validators.required]),
      siteContactName: new UntypedFormControl('', [Validators.required]),
      siteContactNumber: new UntypedFormControl('', [Validators.required]),
      shipToAddress: new UntypedFormControl(null),
      shipToStreet: new UntypedFormControl('', [Validators.required]),
      suburb: new UntypedFormControl('', [Validators.required]),
      postcode: new UntypedFormControl(null),
      notification: new UntypedFormControl(false),
      shipToName: new UntypedFormControl(null),
      specialDelivery: new UntypedFormControl(''),
    });
    let currentDayVal;
    let today = new Date().getDay();


    let todayDate = new Date();

    if (today == 6) {
      currentDayVal = 2;
      todayDate.setDate(todayDate.getDate() + 2);
    }
    else if (today == 7) {
      currentDayVal = 1;
      todayDate.setDate(todayDate.getDate() + 1);
    }
    else {
      currentDayVal = 1;
      todayDate.setDate(todayDate.getDate() + 1);
    }

    this.minDate = {
      day: todayDate.getDate(),
      month: todayDate.getMonth()+1,
      year: todayDate.getFullYear(),
    }
    this.getDeliveryDetails();
  }

  changeSortOption(code, name) {
    this.selectedSortName = name;
    this.selectedSortCode = code
    if (this.reqDelDate) {
      this.checkDeliveryDateTime();
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  submit() {
    if(this.deliveryForm.valid) {
      let postFormValues = this.mapDeliveryFormValues(this.deliveryForm.value);
      this.subscription.add(this.placeOrderService.submitForReviewOrder('Delivery', postFormValues).subscribe((data) => {
        this.shareEvents.checkDeliveryData.push(data);
        this.shareEvents.cartUpdateSendEvent(data);
        this.onReviewClick.emit(data);
      }))
    }
  }

  mapDeliveryFormValues(formValue) {
    let addressIdVal;
    let stateVal;
    if(this.selectedStateName !== null && this.selectedStateName !== undefined) {
      stateVal = {
        "isocode": this.selectedStateName?.isocode
      }
    } else {
      stateVal = null;
    }
    if(this.isNewAddress == true) {
      addressIdVal = {
        "addressName": this.deliveryForm.controls['shipToName'].value,
        "country": {
          "isocode": this.selectedCountryName?.isocode
        },
        "line1": this.deliveryForm.controls['shipToStreet'].value,
        "line2": "",
        "postalCode": this.deliveryForm.controls['postcode'].value,
        "region": stateVal,
        "town": this.deliveryForm.controls['suburb'].value
      }
      this.selectedAddressId = null;
    }
    return {
      "requestedDate": this.reqDelDate,
      "requestedTime": this.selectedSortCode,
      "purchaseOrderNumber": this.deliveryForm.controls['poNumber'].value,
      "contactName": this.deliveryForm.controls['siteContactName'].value,
      "contactPhoneNumber": this.deliveryForm.controls['siteContactNumber'].value,
      "addressId": this.selectedAddressId,
      "newDeliveryAddress": addressIdVal,
      "specialInstructions": this.deliveryForm.controls['specialDelivery'].value
    }
    
  }

  // Get Delivery Details
  getDeliveryDetails() {
    this.isLoading$.next(true);
    this.subscription.add(this.placeOrderService.getDelivery_PickupDetails('Delivery').subscribe(data => {
      if(data) {
        this.existingDeliveryOption = data.deliveryAddresses;
        let defaultAddress = []
        data.deliveryAddresses.forEach((elementData) => {
          if(elementData.defaultAddress == true) {
              defaultAddress.push(elementData);
          }
        });
        this.reqDeliveryTime = data.deliveryTimeOptions;
        this.formSetValue(defaultAddress[0])
      }
      this.isLoading$.next(false);
    }));
  }

  formSetValue(formData) {
    this.deliveryForm.controls.shipToName.setValue(formData?.addressName);
    this.deliveryForm.controls.shipToStreet.setValue(formData?.line1);
    this.deliveryForm.controls.suburb.setValue(formData?.town);
    this.deliveryForm.controls.postcode.setValue(formData?.postalCode);
    this.selectedCountryName = formData?.country;
    this.selectedStateName = formData?.region;
    this.selectedAddressId = formData?.id
  }

  // On Req Delivery Date Calender
  onDateReqSelect(ev) {
    let formatDelDate = ev.year + '-' + ev.month + '-' + ev.day;
    this.reqDelDate = this.datepipe.transform(formatDelDate, 'yyyy-MM-dd');
    if (this.selectedSortName) {
      this.checkDeliveryDateTime();
    }
  }

  // Check given Date Time validation
  checkDeliveryDateTime() {
    let dateTimeObj = {
      "requestedDate": this.reqDelDate,
      "requestedTime": this.selectedSortCode,
    }
    this.subscription.add(this.placeOrderService.getDeliveryCheck('Delivery', dateTimeObj).subscribe((data) => {
      this.reqErrorValid = false;
      this.reqDateErrorMSG.next('');
    }, error => {
      this.reqErrorValid = true;
      this.reqDateErrorMSG.next(error.error.errors[0].message);
    }))
  }

  changeExistingShipOption(selectedAddress) {
    this.formSetValue(selectedAddress);
    // inverse change address, disable form population properties
    this.selectedAddressId = selectedAddress.id;
    this.isNewAddress = false;
    this.isDataPopulated = true;
    this.disableToggleInputs();
    this.formActive();
  }

  formActive() {
    this.deliveryForm.controls['shipToStreet'].markAsUntouched();
    this.deliveryForm.controls['suburb'].markAsUntouched();
  }

  changeNewAddress() {
    this.isNewAddress = true;
    // enable/disable form population properties
    this.isDataPopulated = false;
    this.disableToggleInputs();
    this.formSetValue('');
    // get countries API consumption
    this.getCountries();
  }

  disableToggleInputs() {
    if (this.isDataPopulated) {
      this.deliveryForm.controls['shipToName'].disable();
      this.deliveryForm.controls['shipToStreet'].disable();
      this.deliveryForm.controls['suburb'].disable();
      this.deliveryForm.controls['postcode'].disable();
    } else {
      this.deliveryForm.controls['shipToName'].enable();
      this.deliveryForm.controls['shipToStreet'].enable();
      this.deliveryForm.controls['suburb'].enable();
      this.deliveryForm.controls['postcode'].enable();
    }
  }

  // state dropdown methods 
  changeStateOption(e) {
    this.selectRegionPlaceholder = false;
    this.selectedStateName = this.stateOption[e];

    this.stateOption.forEach(k => {
      k.selected = false;
    });

    this.stateOption[e].selected = true;
  }

  // country dropdown methods 
  changeCountryOption(e, item) {
    this.selectedCountryName = this.countryOption$[e];

    this.countryOption$.forEach(k => {
      k.selected = false;
    });

    this.countryOption$[e].selected = true;
    this.getStates(this.countryOption$[e]?.isocode);
  }

  getCountries() {
    this.subscription.add(this.countriesStates.getCountries().subscribe(res => {
      this.countryOption$ = res['countries'];
      this.countryOption$.map((c, i) => i == 0 ? c.selected = true : c.selected = false);
      this.selectedCountryName = this.countryOption$[0];
      this.countryList.next(this.countryOption$);
      // get states on the basis of selected Country
      this.getStates(this.countryOption$[0]?.isocode);
    }))
  }

  getStates(countryCode) {
    this.subscription.add(this.countriesStates.getStates(countryCode).subscribe(res => {
      this.stateOption = res['regions'];
      this.stateOption.map((s, i) => i == -1 ? s.selected = true : s.selected = false);
      if(this.stateOption.length > 0) {
        this.selectRegionPlaceholder = true;
      } else {
        this.selectRegionPlaceholder = false;
      }
      this.selectedStateName = this.stateOption[0];
      this.stateList.next(this.stateOption)
    }));
  }

  validateChar(event) {
    var regex = new RegExp("^[0-9-+()-]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
