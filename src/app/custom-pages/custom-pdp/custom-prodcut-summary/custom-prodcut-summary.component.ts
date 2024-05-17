import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { GET_Prodcut_Details } from '../../../core/service/endPointURL';

@Component({
  selector: 'app-custom-prodcut-summary',
  templateUrl: './custom-prodcut-summary.component.html',
  styleUrls: ['./custom-prodcut-summary.component.scss']
})
export class CustomProdcutSummaryComponent implements OnInit, OnChanges {

  product$: Observable<Product> = this.currentProductService.getProduct();
  promotions: any;
  currentProdcut = this.product$ as Product;

  constructor(
    private currentProductService: CurrentProductService,
    private shareEvents: ShareEvents,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }


}
