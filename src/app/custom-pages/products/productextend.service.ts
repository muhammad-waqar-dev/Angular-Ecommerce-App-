import { Injectable } from '@angular/core';
import { ProductListComponentService } from '@spartacus/storefront';

@Injectable({
  providedIn: 'root'
})
export class ProductextendService extends ProductListComponentService {
 public defaultPageSize = 12;

 public facetCategoryState = [];
 public facetSubCategoryState = [];
}
