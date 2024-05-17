import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_DELIVERY_PICKUP, POST_CartEmptyOrder, POST_CardPaymentOrder, POST_DELIVERY_CHECK, POST_FOR_REVIEW_Order_CHECK, POST_PaymentOrder, GET_CartDetails } from 'src/app/core/service/endPointURL';
import { ShareEvents } from '../shareEvents.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceOrderService {

  constructor(private http: HttpClient, private shareEvents: ShareEvents,) { }

  // Get Delivery / Pickup Details API
  getDelivery_PickupDetails(deliveryMode: string): Observable<any> {
    let apiUrl = GET_DELIVERY_PICKUP.url;
    return this.http.get<any>(`${apiUrl}/${deliveryMode}` + '?fields=DEFAULT, deliveryAddresses(country(isocode, name), region(isocode, name))');
  }

  // Check Delivery Date Time
  getDeliveryCheck(deliveryMode, deliveryDateTime) {
    let apiUrl = POST_DELIVERY_CHECK.url;
    return this.http.post<any>(`${apiUrl}/${deliveryMode}`, deliveryDateTime)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  // Submit for Review Your Order
  submitForReviewOrder(deliveryMode, orderData) {
    let apiUrl = POST_FOR_REVIEW_Order_CHECK.url;
    return this.http.post<any>(`${apiUrl}/${deliveryMode}` + '?fields=DEFAULT,entries(totalPrice(formattedValue),product(images(FULL),stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),deliveryCost(formattedValue),totalTax(formattedValue,value),net,user,saveTime,name,description,deliveryMode(code),deliveryMode(code)&lang=en&curr=AUD', orderData)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  // Card Payment
  getCardPaymentDetails() {
    let apiUrl = POST_CardPaymentOrder.url;
    let paymentTypeOption = {
      "orderNumber": this.shareEvents.orderCode,
      "transactionReference": this.shareEvents.otp

    }
    return this.http.post<any>(`${apiUrl}`, paymentTypeOption)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  // Account Payment
  getChargeToCreditPayment() {
    let apiUrl = POST_PaymentOrder.url;
    let paymentTypeVal = {
      "paymentType": this.shareEvents.selectedPaymentAccountType
    }
    return this.http.post<any>(`${apiUrl}`, paymentTypeVal)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  // CartEmpty
  cartEmpty() {
    let apiUrl = POST_CartEmptyOrder.url;
    return this.http.post<any>(`${apiUrl}`, '')
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  // Get Cart Details
  getCartDetails() {
    let apiUrl = GET_CartDetails.url;
    return this.http.get<any>(`${apiUrl}`)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }
}
