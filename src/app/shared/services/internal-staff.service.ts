import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { POST_Internal_Staff } from '../../core/service/endPointURL';

@Injectable({
  providedIn: 'root'
})
export class InternalStaffService {

  constructor(
    private http: HttpClient
  ) { }

  // POST internal staff 
  searchInternalStaff(fbCSRToken: any, fbCSRTradeAcc: any): Observable<any> {
    let params = new HttpParams();
    let apiUrl = `${POST_Internal_Staff.url}?tradeAccount=${fbCSRTradeAcc}`;

    params = params.set("fbCSRToken", fbCSRToken);
    params = params.set("fbCSRTradeAcc", fbCSRTradeAcc);

    return this.http.post<any>(apiUrl, { params: params });
  }

}
