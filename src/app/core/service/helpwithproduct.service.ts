import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_PRODUCT_INQUIRY } from "./endPointURL";

@Injectable()
export class ProductHelpService {
  constructor(private http: HttpClient) {}

  public sendProductHelpInquiry(noteData: string): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    let url = POST_PRODUCT_INQUIRY.url;
    return this.http
      .post(url, noteData, {
        headers: { "Content-Type": "application/json" }
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
