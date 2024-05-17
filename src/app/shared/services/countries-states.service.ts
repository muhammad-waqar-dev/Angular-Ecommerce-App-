import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { GET_COUNTRIES, GET_STATES } from '../../core/service/endPointURL';

@Injectable({
  providedIn: 'root'
})
export class CountriesStatesService {

  constructor(
    private http: HttpClient
  ) { }

  // get countries 
  getCountries(): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_COUNTRIES.url;

    params = params.set("fields", 'DEFAULT');
    params = params.set("type", 'SHIPPING');

    return this.http.get<any>(apiUrl, { params: params });
  }

  // get states 
  getStates(countryCode: string): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_STATES.url;

    params = params.set("fields", 'DEFAULT');

    return this.http.get<any>(`${apiUrl}/${countryCode}/regions`, { params: params });
  }

}
