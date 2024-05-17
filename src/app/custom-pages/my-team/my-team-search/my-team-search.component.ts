import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-my-team-search',
  templateUrl: './my-team-search.component.html',
  styleUrls: ['./my-team-search.component.scss']
})
export class MyTeamSearchComponent implements OnInit, OnDestroy {
  searchMemberForm: UntypedFormGroup;
  @Output() searchQuery: EventEmitter<any> = new EventEmitter();
  @Output() clearSearch: EventEmitter<any> = new EventEmitter();
  memberSearchVal: any;
  isMobile = CommonUtils.isMobile();
  constructor(private fb: UntypedFormBuilder, private shareEvents: ShareEvents) { 
    this.shareEvents.resetTeamSearchReceiveEvent().subscribe((data) => {
      this.searchMemberForm.controls.search.setValue('');
      this.shareEvents.teamMemberSearchVal = '';
    });
  }

  ngOnInit(): void {
    this.searchMemberForm = this.fb.group(
      {
        search: new UntypedFormControl(null),
      }
    );
    if(!(window.location.pathname.includes('my-team'))) {
      this.shareEvents.teamMemberSearchVal = '';
    }
    this.searchMemberForm.controls.search.setValue(this.shareEvents.teamMemberSearchVal);
  }


  submit() {
    if(this.searchMemberForm.controls.search.value !== null && this.searchMemberForm.controls.search.value !== ''){
      this.shareEvents.teamMemberSearchVal = this.searchMemberForm.controls.search.value;
      this.searchQuery.emit(this.searchMemberForm.controls.search.value);
    }

  }

  resetSearch(){
    this.searchMemberForm.controls.search.setValue('');
    this.clearSearch.emit();
    this.shareEvents.teamMemberSearchVal = '';
  }

  ngOnDestroy(): void {
    if(!(window.location.pathname.includes('my-team')) && !this.isMobile) {
      this.resetSearch();
    }
  }

}
