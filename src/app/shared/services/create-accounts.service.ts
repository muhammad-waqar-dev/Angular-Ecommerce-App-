import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_CreateAccountURL } from "src/app/core/service/endPointURL";

@Injectable()
export class CreateAccountsService {
    constructor(private http: HttpClient) { }

    public createAccount(formData) {
        let url = POST_CreateAccountURL.url;
        return this.http.post<any>(url, formData, {
            headers: { 'Content-Type': 'application/json' }
         })
        .pipe(
          catchError(errorRes => {
            return throwError(errorRes);
          })
        )
    }
}

