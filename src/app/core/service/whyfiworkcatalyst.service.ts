import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_WORKWHYFIDETAIL } from "./endPointURL";

@Injectable()
export class WhyfiworkCatalystService {
    constructor(private http: HttpClient) { }

    public sendWorkCatalyst(noteData): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_WORKWHYFIDETAIL.url;
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text'
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }
}