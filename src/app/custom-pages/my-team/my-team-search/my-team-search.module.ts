import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamSearchComponent } from './my-team-search.component';
import { FormsModule }   from '@angular/forms';
 import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MyTeamSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule

  ],
  exports: [
    MyTeamSearchComponent
  ]
})
export class MyTeamSearchModule { }
