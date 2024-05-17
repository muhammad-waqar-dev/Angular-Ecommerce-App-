import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';
import { OrderDeliveryService } from 'src/app/shared/services/order-delivery.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'order-deliveries-filters',
  templateUrl: './order-deliveries-filters.component.html',
  styleUrls: ['./order-deliveries-filters.component.scss']
})
export class OrderDeliveriesFiltersComponent implements OnChanges {

  @Input() filtersModel;
  @Input() filtersState;
  @Output() filterSelected: EventEmitter<any> = new EventEmitter();
  @Output() clearMobileFilters: EventEmitter<any> = new EventEmitter();

  isMobile = CommonUtils.isMobile();
  SortPipe = SortPipe;

  constructor(private modalService: NgbModal, private orderService: OrderDeliveryService, 
    private shareEvents: ShareEvents) { }
  filtersCategoryState = [];
  ngOnChanges(): void {
  }

  toggleFilterItems(i, catName){
    this.clearSearchonFilterClick();
    this.filtersCategoryState[catName] = !this.filtersCategoryState[catName];
  }
  selectFilter(filterIndex, valueIndex, filter, value){
    if(this.selectedLength() > 1 || (!value.selected && this.selectedLength() > 0))
    {
    this.clearSearchonFilterClick();
    this.filterSelected.emit({filter: filter, value: value, selected: !value.selected})
    }
  }
  resetAndCloseForm() {
     this.modalService.dismissAll();
   }

   clearSearchonFilterClick() {
    this.shareEvents.orderSearchVal = '';
    this.shareEvents.orderSearchFromDate = '';
    this.shareEvents.orderSearchToDate = '';
    this.orderService.freeTextSearchQuery = '';
    this.orderService.createdBefore = '';
    this.orderService.createdAfter = '';
   }

   selectedLength(){
    let count = 0;
    if(this.orderService.deliveredOrderFilter){
      count++
    }
    
    this.filtersModel[0].values.forEach(element => {
      if(element.selected){
        count++;
      }
    });
   return count;
  }

  clearFilters(){
    this.clearMobileFilters.emit(true)

  }

}
