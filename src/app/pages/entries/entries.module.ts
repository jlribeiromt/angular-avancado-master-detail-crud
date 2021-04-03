import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { RouterModule } from '@angular/router';
import { EntryFormComponent } from './entry-form/entry-form.component';

import { CalendarModule } from "primeng/calendar";
import { IMaskModule } from 'angular-imask';


@NgModule({
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    EntriesRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    IMaskModule,
  ]
})
export class EntriesModule { }
