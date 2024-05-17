import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamsUpdateTeamMemberComponent } from './update-team-member.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';
import { NgbDateCustomParserFormatter } from '../../../shared/services/ngDateParserFormatter.service';
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { GlobalsortpipeModule } from 'src/app/shared/pipes/globalsortpipe.module';

@NgModule({
  imports: [
    CommonModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FIConfirmationPopupModule,
    GlobalsortpipeModule
  ],
  declarations: [MyTeamsUpdateTeamMemberComponent],
  exports: [MyTeamsUpdateTeamMemberComponent],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class MyteamsUpdateMemberModule { }
