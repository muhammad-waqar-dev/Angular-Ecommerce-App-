export class UserResponseModel {
    users: user[];
    sorts: sort[];
    pagination: pagination;
    filters: filter;
}
export class OrgUnit {
    active: boolean;
    name: string;
    uid: string;
}

export class sort {
    code: string;
    selected: boolean;
}

export class pagination {
    currentPage: number;
    pageSize: number;
    sort: string;
    totalPages: number;
    totalResults: number;
}

export class user {
    name: string;
    uid: string;
    active: boolean;
    customerId: string;
    roles: string[];
    selected: boolean;
    orgUnit: OrgUnit;
    phoneNumber: string;
    jobTitle: string;
    accountStatus: string;
}

export class filter {
    name: string;
    code: string;
    values: filterValue;
}
export class filterValue {
    name: string;
    code: string;
    selected: boolean;
}