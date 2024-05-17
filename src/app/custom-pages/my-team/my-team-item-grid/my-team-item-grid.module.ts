import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamItemGridComponent } from './my-team-item-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { GlobalsortpipeModule } from 'src/app/shared/pipes/globalsortpipe.module';
import { RemoveTeamMemberModule } from '../remove-team-member/remove-team-member.module';
import { MyteamsUpdateMemberModule } from '../update-team-member/update-team-member.module';

@NgModule({
  declarations: [MyTeamItemGridComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    GlobalsortpipeModule,
    RemoveTeamMemberModule,
    MyteamsUpdateMemberModule,
  ],
  exports: [MyTeamItemGridComponent],
  providers: []
})
export class MyTeamItemGridModule { }
