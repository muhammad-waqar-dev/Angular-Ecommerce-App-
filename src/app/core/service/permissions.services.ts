import { Injectable } from "@angular/core";
import { ShareEvents } from "src/app/shared/shareEvents.service";

@Injectable()
export class PermissionService {

    constructor(private shareEvents: ShareEvents) { }
    private userPermissions: string[] = [];
    private orgData: any;

    setUserPermissions(permissions: string[]) {
        this.userPermissions = permissions;
        this.shareEvents.accountsInfoAvailableSubjectSendEvent();
    }


    setOrgData(orgData: any): any {
        this.orgData = orgData;
        localStorage.setItem('orgData', orgData);
    }

    getOrgData(): any {
        const localData: any = localStorage.getItem('orgData');
        return this.orgData?.length ? this.orgData : localData;
    }

    isPermissionAllowed(permission: any) {
        this.userPermissions = this.userPermissions?.length ? this.userPermissions : this.getOrgData();
        // If User User, Provide All Permissions
        return (this.userPermissions?.indexOf("fbAccountOwnerAdminGroup") > -1) || ((this.userPermissions?.indexOf(permission) > -1) || sessionStorage.getItem('internalUser') == 'true');
    }

}