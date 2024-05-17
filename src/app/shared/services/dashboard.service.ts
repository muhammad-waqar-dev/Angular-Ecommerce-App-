import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { GET_QUOTES, GET_QUOTE_DETAILS, GET_ORDERS } from '../../core/service/endPointURL';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DashboardService {
    
    constructor(private http: HttpClient) { }

    getQuoteData(currentPage, pageSize, sort, query): Observable<any> {

        let params = new HttpParams();
        let apiUrl = GET_QUOTES.url;
        params = params.set("currentPage", currentPage);
        params = params.set("fields", 'DEFAULT');
        params = params.set("pageSize", pageSize);
        params = params.set("sort", sort);
        params = params.set("query", query);

        return this.http.get<any>(apiUrl, { params: params });
    }

    getQuoteDetails(code): Observable<any> {
        let apiUrl = GET_QUOTE_DETAILS.url;

        return this.http.get<any>(`${apiUrl}/{quoteCode}?quoteCode=${code}`);
    }

    getOrderCreatedData(createdBefore, createdAfter, pageSize): Observable<any> {
        let params = new HttpParams();
        let apiUrl = GET_ORDERS.url;
     
        params = params.set("currentPage", '0');
        params = params.set("fields", 'BASIC');
        params = params.set("pageSize", pageSize);
        params = params.set("currentOrderfilter", 'true')
        params = params.set("sortString", 'date:DESC')

        return this.http.get<any>(apiUrl, { params: params })
        .pipe(
          catchError(errorRes => {
            return throwError(errorRes);
          })
        );
      }
      getOrderDeliverydData(createdBefore, createdAfter, pageSize): Observable<any> {
        let params = new HttpParams();
        let apiUrl = GET_ORDERS.url;
        // requesteddeliverydate
     
        params = params.set("currentPage", '0');
        params = params.set("fields", 'BASIC');
        params = params.set("pageSize", pageSize);
        params = params.set("deliveredOrderfilter", 'true')
        params = params.set("sortString", 'date:DESC')
       
        return this.http.get<any>(apiUrl, { params: params })
        .pipe(
          catchError(errorRes => {
            return throwError(errorRes);
          })
        );
      }
      

}