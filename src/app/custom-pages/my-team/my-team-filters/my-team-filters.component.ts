import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { MyTeamService } from 'src/app/shared/services/my-team.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-my-team-filters',
  templateUrl: './my-team-filters.component.html',
  styleUrls: ['./my-team-filters.component.scss']
})
export class MyTeamFiltersComponent implements OnChanges {

  @Input() filtersModel;
  @Input() filtersState;
  @Output() filterSelected: EventEmitter<any> = new EventEmitter();
  @Output() clearMobileFilters: EventEmitter<any> = new EventEmitter();

  
  isMobile = CommonUtils.isMobile();

  constructor(private modalService: NgbModal, private teamsService: MyTeamService, private shareEvents: ShareEvents) { }
  filtersCategoryState = [];
  ngOnChanges(): void {}

  toggleFilterItems(i, catName){
    this.shareEvents.resetTeamSearchSendEvent();
    this.filtersCategoryState[catName] = !this.filtersCategoryState[catName];
  }
  selectFilter(filterIndex, valueIndex, filter, value){
    this.shareEvents.resetTeamSearchSendEvent();
    this.filtersState[filterIndex][valueIndex] = !this.filtersState[filterIndex][valueIndex];
    this.filterSelected.emit({filter: filter, value: value, selected: this.filtersState[filterIndex][valueIndex]})
  }
  resetAndCloseForm() {
     this.modalService.dismissAll();
   }

  clearFilters(){
    this.clearMobileFilters.emit(true)

  }
}
