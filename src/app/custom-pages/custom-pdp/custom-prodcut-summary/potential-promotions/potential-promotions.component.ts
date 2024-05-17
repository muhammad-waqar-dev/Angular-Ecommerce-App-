import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GET_Prodcut_Details } from '../../../../core/service/endPointURL';

@Component({
  selector: 'app-potential-promotions',
  templateUrl: './potential-promotions.component.html',
  styleUrls: ['./potential-promotions.component.scss']
})
export class PotentialPromotionsComponent implements OnInit, OnChanges {

  @Input() productCode: any;
  product: any;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getPotentialPromotions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  getPotentialPromotions(): void {
    let apiUrl = GET_Prodcut_Details(this.productCode)?.url;
    this.http.get(apiUrl).subscribe((res: any) => {
      this.product = res;
      this.cdr.detectChanges();
    });
  }

}
