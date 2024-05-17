import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { GET_ORDERS, GET_ORDER_Details, GET_ORDER_Statement, POST_ChangeOrder, POST_RequestForPod } from '../../core/service/endPointURL';

@Injectable()
export class OrderDeliveryService {

  freeTextSearchQuery: string = '';
  filters: string = '';
  deliveredOrderFilter: boolean = false;
  currentOrderFilter: boolean = true;
  sortOrder = 'DESC' 
  createdBefore: string = ''
  createdAfter: string = ''
  sortOrderState = []
  constructor(private http: HttpClient) {}

  getOrderData(currentPage, pageSize, sortBy, search): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_ORDERS.url;
  if(!this.sortOrderState[sortBy] )
      {
        this.sortOrderState[sortBy] = 'DESC'
      }
    params = params.set("currentPage", currentPage);
    params = params.set("fields", 'BASIC');
    params = params.set("pageSize", pageSize);
    params = params.set("sortString", sortBy + ':' + this.sortOrderState[sortBy]);

    //filters
    if(this.filters.length < 1 && !this.currentOrderFilter && !this.deliveredOrderFilter){
      this.filters = 'ALL'
    }


    if(this.filters.length > 0){
      params = params.set("statuses", this.filters);
    }
    if(this.deliveredOrderFilter){
      params = params.set("deliveredOrderfilter", this.deliveredOrderFilter.toString());
    }
    if(this.currentOrderFilter){
      params = params.set("currentOrderfilter", this.currentOrderFilter.toString());
    }
    
    //search
    if(this.freeTextSearchQuery.length > 0){
      params = params.set("searchText",search);
    }
    //date
    if(this.createdBefore.length > 1 && this.createdAfter.length > 1) {
      params = params.set("createdBefore", this.createdBefore);
      params = params.set("createdAfter", this.createdAfter);
    }
    return this.http.get<any>(apiUrl, { params: params })
    .pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  getOrderDetails(guid): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_ORDER_Details.url;

    params = params.set("fields", 'DEFAULT');
    return this.http.get<any>(`${apiUrl}/${guid}`, { params: params });
  }

  changeDetailOrder(orderData) {
    let apiUrl = POST_ChangeOrder.url;
    return this.http.post<any>(`${apiUrl}`, orderData, {
      headers: { 'Content-Type': 'application/json' },})
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  requestForPod(data) {
    let apiUrl = POST_RequestForPod.url;
    return this.http.post<any>(`${apiUrl}`, data, {
      headers: { 'Content-Type': 'application/json' },})
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
  }

  downloadPDF(type: any, docDate: any, docNumber: any): any {
    let url = `${GET_ORDER_Statement.url}/${type}`;

    let params = new HttpParams();

    params = params.set('docDate', docDate)
    params = params.set('docNumber', docNumber)

    const httpOptions = {
      responseType: 'blob' as 'json',
      params: params
    };

    return this.http.get(url, httpOptions);
  }
}
