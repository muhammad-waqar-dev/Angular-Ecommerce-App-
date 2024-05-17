import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamsAddTeamMemberComponent } from './add-team-member.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';
import { NgbDateCustomParserFormatter } from '../../../shared/services/ngDateParserFormatter.service';
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FIConfirmationPopupModule
  ],
  declarations: [MyTeamsAddTeamMemberComponent],
  exports: [MyTeamsAddTeamMemberComponent],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class MyteamsAddMemberModule { }
