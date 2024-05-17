import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  isUpdated: boolean = false;
  isInternalStaff: boolean = false;
  productPageSize: any;

  constructor(){}

  cartUpdated(): void {
    this.isUpdated = true;
  }

  getProductsPageSize(): any {
    return this.productPageSize;
  }

  setProductsPageSize(pageSize?: any): void {
    this.productPageSize = pageSize || 12;
  }

  getIsUpdated(): boolean {
    return this.isUpdated;
  }

  setInternalStaff(value: boolean): void {
    this.isInternalStaff = value;
  }

  getInternalStaff(): boolean {
    return this.isInternalStaff;
  }

  cartUpdateDone(): void {
    this.isUpdated = false;
  }
}
