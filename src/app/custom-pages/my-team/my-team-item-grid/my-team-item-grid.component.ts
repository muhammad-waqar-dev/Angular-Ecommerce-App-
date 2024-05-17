import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { myTeamConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';
import {
  NgbCalendar, NgbDateAdapter, NgbDateParserFormatter,
  NgbDateStruct, NgbInputDatepickerConfig, NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-my-team-item-grid',
  templateUrl: './my-team-item-grid.component.html',
  styleUrls: ['./my-team-item-grid.component.scss']
})
export class MyTeamItemGridComponent implements OnInit {
  @Input() user: any;
  @Input() index: any;
  @Output() removeMember: EventEmitter<any> = new EventEmitter();
  @Output() updateMember: EventEmitter<any> = new EventEmitter();
  myTeam = myTeamConstants;
  myTeamForm: UntypedFormGroup;
  isMobile = CommonUtils.isMobile();

  model1: string;
  model2: string;
  numpattern = '[0-9]*$';
  model: NgbDateStruct | any | null | NgbDate;
  @ViewChild('dp', { static: false }) ngbDatepicker;
  constructor(private fb: UntypedFormBuilder, private shareEvents: ShareEvents,) { }

  NgbDateStruct = {
    year: 2021,
    month: 1,
    day: 2
  };
  date: { year: number, month: number };
  ngOnInit(): void {
    this.myTeamForm = this.fb.group({
      emailAddress: new UntypedFormControl({value: this.user.email, disabled: true}, [Validators.required, Validators.email]),
      phoneNumber: new UntypedFormControl({value: this.user.phoneNumber, disabled: true}, []),
      jobTitle: new UntypedFormControl({value: this.user.jobTitle, disabled: true}, []),
      validFrom: new UntypedFormControl({value: '', disabled: true}),
      validTo: new UntypedFormControl({value: '', disabled: true}),
    });

  }

  removeTeamMember(e) {
    this.removeMember.emit(e);

  }

  submit($event) {
  }
  onRemoveTeamMemberConfirmed() {

  }
  openUpdateModal(e) {
    this.shareEvents.updateTeamMemberSubjectSendEvent(JSON.parse(JSON.stringify(e)));
  }

}
