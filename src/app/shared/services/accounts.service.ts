import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  GET_creditPaymentGraphURL,
  POST_DISPUTE_INVOICE,
  GET_AccountsStatements,
  GET_Accounts,
  GET_Invoice_Statement,
} from "src/app/core/service/endPointURL";

@Injectable()
export class AccountsService {
  invoicePaymentSubTotal = 0;
  invoicePaymentObject: any;
  creditLimit = "000.00";
  isShowStatements = false;
  invoiceNumDetail = "";

  docType = "Make a Payment";

  constructor(private http: HttpClient, public datepipe: DatePipe) {}
  dateEnd: string = "";
  dateStart: string = "";

  CustomerReferenceNumber: string = "";
  documentNumber: string = "";
  searchBy = "";
  sortOrderState = "documentDate:ASC";
  filters;
  billingstatusFilter = "ALL";

  public creditPaymentGraphData() {
    let url = GET_creditPaymentGraphURL.url;
    return this.http.get<any>(url).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  public disputeInvoice(data: any): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    let url = POST_DISPUTE_INVOICE.url;

    return this.http
      .post(url, data, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public statementsData() {
    let url = GET_AccountsStatements.url;
    return this.http.get<any>(url).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  public getAccountData(
    currentPage: any,
    pageSize: any,
    historicalData: boolean
  ): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_Accounts.url;

    let filter: any;
    if (this.filters && this.filters.length > 0) {
      filter = this.filters;
    } else {
      filter = "ALL";
    }

    //DEBITMEMO
    params = params.set("documentTypes", filter);

    if (this.billingstatusFilter === "") {
      this.billingstatusFilter = "ALL";
    }
    if (
      this.billingstatusFilter?.length &&
      this.billingstatusFilter?.length > 1
    ) {
      params = params.set("billingStatuses", this.billingstatusFilter);
    }
    if (
      this.CustomerReferenceNumber?.length &&
      this.CustomerReferenceNumber?.length > 1
    ) {
      params = params.set("searchBy", this.searchBy);
      params = params.set(
        "customerReferenceNumber",
        this.CustomerReferenceNumber
      );
    }

    if (this.documentNumber?.length && this.documentNumber?.length > 1) {
      params = params.set("searchBy", this.searchBy);
      params = params.set("documentNumber", this.documentNumber);
    }

    if (this.dateEnd?.length > 1 && this.dateStart?.length > 1) {
      params = params.set("dateEnd", this.dateEnd);
      params = params.set("dateStart", this.dateStart);
    }

    params = params.set("currentPage", currentPage);
    params = params.set("pageSize", pageSize);
    params = params.set("sortString", this.sortOrderState);
    params = params.set("historicalData", historicalData);
    // params = params.set("CustomerReferenceNumber", '81462');
    debugger;
    return this.http.get<any>(apiUrl, { params: params }).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  public getAccountDataForPayments(historicalData: boolean = false): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_Accounts.url;

    params = params.set("documentTypes", "ALL");
    params = params.set("billingStatuses", "UNPAID");
    params = params.set("currentPage", "0");
    params = params.set("pageSize", "200");
    params = params.set("historicalData", historicalData);

    return this.http.get<any>(apiUrl, { params: params }).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  public getInvoiceStatement(type: any, docDate: any, docNumber?: any) {
    let url = `${GET_Invoice_Statement.url}/${type}`;

    let params = new HttpParams();

    if (docNumber) {
      params = params.set("docDate", docDate);
      params = params.set("docNumber", docNumber);
    } else {
      params = params.set("docDate", docDate);
    }

    return this.http.get<any>(url, { params: params }).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  downloadPDF(
    type: any,
    docDate: any,
    docNumber?: any,
    historicalData?: boolean
  ): any {
    // let url = `${GET_Invoice_Statement.url}`;
    let convertDate = this.datepipe.transform(docDate, 'yyyy-MM-dd');
    let url = type == 'STATEMENT' ? GET_AccountsStatements.pdfUrl+'/getStatementsPDF?date='+docDate+'&lang=en&curr=AUD' :
    type == 'REBATE' && !historicalData ? GET_AccountsStatements.pdfUrl+'/REBATE?docDate='+convertDate : `${GET_Invoice_Statement.url}`;

    let params = new HttpParams();
    if (type == 'STATEMENT' && docDate) {
      params = params.set("statementDate", docDate);
    }
    if (docNumber) {
      params = params.set("docNumber", docNumber);
    }
    if (historicalData) {
      params = params.set("historicalData", historicalData);
    }

    const httpOptions = {
      responseType: "blob" as "json",
      params: params,
    };

    return this.http.get(url, httpOptions);
  }
}
