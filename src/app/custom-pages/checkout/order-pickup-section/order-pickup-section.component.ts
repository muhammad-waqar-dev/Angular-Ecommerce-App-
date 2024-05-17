import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CountriesStatesService } from 'src/app/shared/services/countries-states.service';
import { PlaceOrderService } from 'src/app/shared/services/place-order.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-order-pickup-section',
  templateUrl: './order-pickup-section.component.html',
  styleUrls: ['./order-pickup-section.component.scss']
})
export class OrderPickupSectionComponent implements OnInit, OnDestroy {
  deliveryForm: UntypedFormGroup;
  pickupForm: UntypedFormGroup;
  @Output() onReviewClick = new EventEmitter();
  nameCheck: boolean = false;
  searchALL: string = 'delivery';
  paymentMethod: string = 'credit-account';
  isLoading$ = new BehaviorSubject<boolean>(true);
  private subscription = new Subscription();
  reqDateErrorMSG = new BehaviorSubject<any>('');
  reqErrorValid: boolean = false;
  existingPickupOption: any;
  pickUpTime: any;
  reqDelDate: any;
  selectedSortCode: any;

  selectedSortName: any = '';
  existingDeliveryOption = [];
  selectedExistingShipName: any = {};
  isNewAddress: boolean = false;
  isDataPopulated: boolean = true;
  selectRegionPlaceholder: boolean = false;
  countryList = new BehaviorSubject<any>('');
  stateList = new BehaviorSubject<any>('');

  // state drowdown properties 
  stateOption: any = [];
  selectedStateName: any = 'Australian Capital Territory';

  // country drowdown properties 
  countryOption: any = [];
  selectedCountryName: any = 'Australia';
  selectedAddressId: any;
  isReviewOrder: boolean = false;
  isPayForYourOrder: boolean = false;
  isOrderSummaryExpanded: boolean = false;
  isFulfilment: boolean = false;
  isMobile: boolean = false;
  minDate: any | null | NgbDate;
  isDisabled;
  model: NgbDateStruct;
  json = {
    disable: [6, 7]
  }
  constructor(private fb: UntypedFormBuilder, private calendar: NgbCalendar,
    private placeOrderService: PlaceOrderService,
    private countriesStates: CountriesStatesService,
    private datepipe: DatePipe,
    private shareEvents: ShareEvents) {
    this.isDisabled = (
      date: NgbDateStruct
    ) => {
      return (this.json.disable.includes(calendar.getWeekday(new NgbDate(date.year, date.month, date.day)))
      ) ? true : false;
    };
  }

  ngOnInit(): void {
    this.formInit();
   this.disableToggleInputs();
    this.shareEvents.receiveCartDate().subscribe((data) => {
      this.submit();
    });
  }

  formInit() {
    this.pickupForm = this.fb.group({
      poNumber: new UntypedFormControl('', [Validators.required]),
      requestedPickupDate: new UntypedFormControl(null),
      contactName: new UntypedFormControl('', [Validators.required]),
      contactPhoneNumber: new UntypedFormControl('', [Validators.required]),
      shipToAddress: new UntypedFormControl(null),
      shipToStreet: new UntypedFormControl('', [Validators.required]),
      suburb: new UntypedFormControl('', [Validators.required]),
      postcode: new UntypedFormControl(null),
      notification: new UntypedFormControl(false),
      shipToName: new UntypedFormControl(null),
      specialDelivery: new UntypedFormControl(''),
    });
    this.minDate = {
      day: this.calendar.getToday().day,
      month: this.calendar.getToday().month,
      year: this.calendar.getToday().year,
    }
    this.getPicupDetails();
  }

  // Get Pickup Detail
  getPicupDetails() {
    this.isLoading$.next(true);
    this.subscription.add(this.placeOrderService.getDelivery_PickupDetails('Pick Up').subscribe(data => {
      if (data) {
        this.existingPickupOption = data.pickupLocationPOS;
        this.pickUpTime = data.weekDayOpeningList[0];
        this.existingDeliveryOption = data.deliveryAddresses;
        let defaultAddress = []
        data.deliveryAddresses.forEach((elementData) => {
          if (elementData.defaultAddress == true) {
            defaultAddress.push(elementData);
          }
        });
        this.formSetValue(defaultAddress[0]);
      }
      this.isLoading$.next(false);
    }));
  }

  formSetValue(pickupData) {
    this.pickupForm.controls.shipToName.setValue(pickupData?.addressName);
    this.pickupForm.controls.shipToStreet.setValue(pickupData?.line1);
    this.pickupForm.controls.suburb.setValue(pickupData?.town);
    this.pickupForm.controls.postcode.setValue(pickupData?.postalCode);
    this.selectedCountryName = pickupData?.country;
    this.selectedStateName = pickupData?.region;
    this.selectedAddressId = pickupData?.id
  }

  changeExistingShipOption(selectedAddress) {
    this.formSetValue(selectedAddress);
    // inverse change address, disable form population properties
    this.isNewAddress = false;
    this.isDataPopulated = true;
    this.selectedAddressId = selectedAddress.id;
    this.disableToggleInputs();
    this.formActive();
  }

  formActive() {
    this.pickupForm.controls['shipToStreet'].markAsUntouched();
    this.pickupForm.controls['suburb'].markAsUntouched();
  }

  changeNewAddress() {
    this.isNewAddress = true;
    // enable/disable form population properties
    this.isDataPopulated = false;
    this.disableToggleInputs();
    this.formSetValue('');
    //this.pickupForm.reset();
    // get countries API consumption
    this.getCountries();
  }

  disableToggleInputs() {
    if (this.isDataPopulated) {
      this.pickupForm.controls['shipToName'].disable();
      this.pickupForm.controls['shipToStreet'].disable();
      this.pickupForm.controls['suburb'].disable();
      this.pickupForm.controls['postcode'].disable();
    } else {
      this.pickupForm.controls['shipToName'].enable();
      this.pickupForm.controls['shipToStreet'].enable();
      this.pickupForm.controls['suburb'].enable();
      this.pickupForm.controls['postcode'].enable();
    }
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
    this.subscription.add(this.placeOrderService.getDeliveryCheck('Pick Up', dateTimeObj).subscribe((data) => {
      this.reqErrorValid = false;
      this.reqDateErrorMSG.next('');
    }, error => {
      this.reqErrorValid = true;
      this.reqDateErrorMSG.next(error.error.errors[0].message);
    }))
  }

  changeSortOption(code, name) {
    this.selectedSortName = name;
    this.selectedSortCode = code
    if (this.reqDelDate) {
      this.checkDeliveryDateTime();
    }
  }

  submit() {
    if (this.pickupForm.valid) {
      let postFormValues = this.mapDeliveryFormValues(this.pickupForm.value);
      this.subscription.add(this.placeOrderService.submitForReviewOrder('Pick Up', postFormValues).subscribe((data) => {
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
        "addressName": this.pickupForm.controls['shipToName'].value,
        "country": {
          "isocode": this.selectedCountryName?.isocode
        },
        "line1": this.pickupForm.controls['shipToStreet'].value,
        "line2": "",
        "postalCode": this.pickupForm.controls['postcode'].value,
        "region": stateVal,
        "town": this.pickupForm.controls['suburb'].value
      }
      this.selectedAddressId = null;
    }
    return {
      "requestedDate": this.reqDelDate,
      "requestedTime": this.selectedSortCode,
      "purchaseOrderNumber": this.pickupForm.controls['poNumber'].value,
      "contactName": this.pickupForm.controls['contactName'].value,
      "contactPhoneNumber": this.pickupForm.controls['contactPhoneNumber'].value,
      "addressId": this.selectedAddressId,
      "newDeliveryAddress": addressIdVal,
      "specialInstructions": this.pickupForm.controls['specialDelivery'].value
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

  changeNewState() {
  }

  // country dropdown methods 
  changeCountryOption(e) {
    this.selectedCountryName = this.countryOption[e];

    this.countryOption.forEach(k => {
      k.selected = false;
    });

    this.countryOption[e].selected = true;
    this.getStates(this.countryOption[e]?.isocode);
  }

  changeNewCountry() {
  }

  getCountries() {
    this.countriesStates.getCountries().subscribe(res => {
      this.countryOption = res['countries'];
      this.countryOption.map((c, i) => i == 0 ? c.selected = true : c.selected = false);
      this.selectedCountryName = this.countryOption[0];
      this.countryList.next(this.countryOption);
      // get states on the basis of selected Country
      this.getStates(this.countryOption[0]?.isocode);
    })
  }

  getStates(countryCode) {
    this.countriesStates.getStates(countryCode).subscribe(res => {
      this.stateOption = res['regions'];
      this.stateOption.map((s, i) => i == -1 ? s.selected = true : s.selected = false);
      if(this.stateOption.length > 0) {
        this.selectRegionPlaceholder = true;
      } else {
        this.selectRegionPlaceholder = false;
      }
      this.selectedStateName = this.stateOption[0];
      this.stateList.next(this.stateOption)
    });
  }

  validateChar(event) {
    var regex = new RegExp("^[0-9-+()-]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
