import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoveTeamMemberComponent } from './remove-team-member.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FIConfirmationPopupModule } from '../../popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';



@NgModule({
  declarations: [RemoveTeamMemberComponent],
  imports: [
    CommonModule,
    NgbModule,
    FIConfirmationPopupModule
  ],
  exports: [RemoveTeamMemberComponent]
})
export class RemoveTeamMemberModule { }
