import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { CommonUtils } from 'src/app/core/utils/utils';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'quote-filters',
  templateUrl: './quote-filters.component.html',
  styleUrls: ['./quote-filters.component.scss']
})
export class QuoteFiltersComponent implements OnChanges {

  @Input() filtersModel;
  @Input() filtersState;
  @Output() filterSelected: EventEmitter<any> = new EventEmitter();
  @Output() clearMobileFilters: EventEmitter<any> = new EventEmitter();

  isMobile = CommonUtils.isMobile();

  constructor(private modalService: NgbModal, private quoteService: QuoteService, 
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
      this.filtersState[filterIndex][valueIndex] = !this.filtersState[filterIndex][valueIndex];
      this.filterSelected.emit({filter: filter, value: value, selected: this.filtersState[filterIndex][valueIndex]})
    }
  }
  clearSearchonFilterClick() {
    this.shareEvents.quoteSearchVal = '';
    this.shareEvents.quoteSearchFromDate = '';
    this.shareEvents.quoteSearchToDate = '';
    this.quoteService.freeTextSearchQuery = '';
    this.quoteService.createdBefore = '';
    this.quoteService.createdAfter = '';
  }
  resetAndCloseForm() {
     this.modalService.dismissAll();
   }

   selectedLength(){
     let count = 0;
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
