import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourcesService } from '../../../shared/services/base-resources.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class EntryService extends BaseResourcesService<Entry> {
  constructor(
    private injector: Injector,
    private categoryService: CategoryService
  ) {
    super('api/entries', injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  getByMounthAndYear(mounth: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map((entries) => this.filterByMounthAndYear(entries, mounth, year))
    );
  }

  private setCategoryAndSendToServer(
    entry: Entry,
    sendFn: any
  ): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap((category) => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }

  private filterByMounthAndYear(
    entries: Entry[],
    mounth: number,
    year: number
  ) {
    return entries.filter((entry) => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      const monthMatches = entryDate.month() + 1 == mounth;
      const yearMatches = entryDate.year() == year;

      if (monthMatches && yearMatches) return entry;
    });
  }
}
