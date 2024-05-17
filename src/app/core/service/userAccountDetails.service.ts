import { Injectable } from "@angular/core";
import { AuthService } from "@spartacus/core";
import { UserAccountFacade } from "@spartacus/user/account/root";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class FIUserAccountDetailsService {

    constructor(private auth: AuthService, private userAccount: UserAccountFacade) { }

    public getUserAccount() {
        return this.auth.isUserLoggedIn().pipe(
            switchMap((isUserLoggedIn) => {
                if (isUserLoggedIn) {
                    return this.userAccount.get();
                } else {
                    return of(undefined);
                }
            })
        );
    }

    public getIsUserLoggedIn() {
        return this.auth.isUserLoggedIn();
    }
}