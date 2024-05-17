import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { GET_PermissionList, POST_ADD_NEW_TEAM_MEMBER_ENDPOINT } from "./endPointURL";

@Injectable()
export class AddNewMemberService {
    constructor(private http: HttpClient) { }

    public addNewMember(noteData: string): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_ADD_NEW_TEAM_MEMBER_ENDPOINT.url;
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json' }
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }

    public updateTeamMember(status, permissionID): Observable<any> {
        let apiUrl = GET_PermissionList.url;
        return this.http.get<any>(`${apiUrl}`+'state='+status+'&usergroupId='+permissionID)
          .pipe(
            catchError(errorRes => {
              return throwError(errorRes);
            })
          )
    }
}