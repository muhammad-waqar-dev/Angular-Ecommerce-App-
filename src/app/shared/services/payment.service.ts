import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { GET_Transaction_OTP, GET_Account_Transaction_OTP, POST_Account_Transaction_DETAIL } from '../../core/service/endPointURL';

@Injectable()
export class PaymentService {

  constructor(private http: HttpClient) { }

  getTransactionOtp(data) {
    let apiUrl = GET_Transaction_OTP.url;

    return this.http.post(`${apiUrl}/getOrderTransactionOTP`, data, { responseType: 'text'})
        .pipe(
            catchError(errorRes => {
                return throwError(errorRes);
            })
        )
  }

  getAccountTransactionOtp(data) {
    let apiUrl = GET_Account_Transaction_OTP.url;

    return this.http.post<any>(`${apiUrl}`, data)
        .pipe(
            catchError(errorRes => {
                return throwError(errorRes);
            })
        )
  }

  getAccountTransactionDetail(refData) {
    let apiUrl = POST_Account_Transaction_DETAIL.url;

    return this.http.post<any>(`${apiUrl}`, refData, {
        headers: { 'Content-Type': 'application/json' },
    })
        .pipe(
            catchError(errorRes => {
                return throwError(errorRes);
            })
        )
  }
  
}