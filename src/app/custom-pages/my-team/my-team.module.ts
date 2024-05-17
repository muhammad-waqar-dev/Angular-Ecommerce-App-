import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamComponent } from './my-team.component';
import { MyteamsAddMemberModule } from './add-team-member/add-team-member.module';
import { MyTeamService } from '../../shared/services/my-team.service';
import { MyTeamFiltersComponent } from './my-team-filters/my-team-filters.component';
import { MyTeamItemGridModule } from './my-team-item-grid/my-team-item-grid.module';
import { MyTeamFiltersModule } from './my-team-filters/my-team-filters.module';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { PaginationModule, ViewConfig } from '@spartacus/storefront';
import { CommonUtils } from 'src/app/core/utils/utils';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyTeamMobileModule } from './my-team-mobile/my-team-mobile.module';
import { RemoveTeamMemberModule } from './remove-team-member/remove-team-member.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerModule } from '@spartacus/storefront';
import { MyTeamSearchModule } from './my-team-search/my-team-search.module';
import { MyteamsUpdateMemberModule } from './update-team-member/update-team-member.module';
import { AccesspermissionmessageModule } from 'src/app/shared/components/accesspermissionmessage/accesspermissionmessage.module';



@NgModule({
  declarations: [MyTeamComponent, MyTeamFiltersComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MyteamsAddMemberModule,
    MyteamsUpdateMemberModule,
    MyTeamItemGridModule,
    MyTeamFiltersModule,
    RemoveTeamMemberModule,
    SpinnerModule,
    PaginationModule,
    InfiniteScrollModule,
    MyTeamSearchModule,
    MyTeamMobileModule,
    AccesspermissionmessageModule,
    ConfigModule.withConfig({
      pagination: {
        addPrevious: true,
        addStart: false,
        addNext: true,
        addEnd: false
      }
    }),
    RemoveTeamMemberModule
  ],
  providers: [
    MyTeamService,
    provideConfig(<ViewConfig>{
      view: {
        infiniteScroll: {
          active: CommonUtils.isMobile(),
          showMoreButton: false
        }
      }
    }),
  ]
})
export class MyTeamModule { }
