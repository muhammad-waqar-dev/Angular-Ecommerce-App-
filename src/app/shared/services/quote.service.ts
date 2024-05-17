import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GET_QUOTES, GET_QUOTE_DETAILS, GET_QUOTE_Statement } from '../../core/service/endPointURL';

@Injectable()
export class QuoteService {
  filters: string = '';
  createdBefore: string = ''
  createdAfter: string = ''
  sortOrder = 'ASC'
  sortOrderState = []
  constructor(private http: HttpClient) {}

freeTextSearchQuery: string = '';
  isFilterApplied: boolean = true;

  getQuoteData(currentPage, pageSize, sort, search, filters): Observable<any> {
    
    if(!this.sortOrderState[sort] )
    {
      this.sortOrderState[sort] = 'ASC'
    }
    let params = new HttpParams();
    let apiUrl = GET_QUOTES.url;
    params = params.set("currentPage", currentPage);
    params = params.set("fields", 'DEFAULT');
    params = params.set("pageSize", pageSize);
    params = params.set("sort", sort + ':' + this.sortOrderState[sort]);

    if(this.freeTextSearchQuery.length > 0){
      params = params.set("searchText", this.freeTextSearchQuery);
    }

    if(this.filters.length < 1){
      this.filters = 'ALLQUOTES'
    }

    if(this.isFilterApplied && this.filters.length > 0)
    {
      params = params.set("query", 'quotes:' + this.filters);
    }
    //date
    if(this.createdBefore.length > 1 && this.createdAfter.length > 1) {
    
      params = params.set("createdBefore", this.createdBefore);
      params = params.set("createdAfter", this.createdAfter);
    }
    
    return this.http.get<any>(apiUrl, { params: params });
  }

  getQuoteDetails(code): Observable<any> {
    let apiUrl = GET_QUOTE_DETAILS.url;

    return this.http.get<any>(`${apiUrl}/{quoteCode}?quoteCode=${code}`);
  }

  downloadPDF(type: any, docDate: any, docNumber: any): any {
    let url = `${GET_QUOTE_Statement.url}/${type}`;

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

