import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    EntryListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    EntriesRoutingModule
  ]
})
export class EntriesModule { }
