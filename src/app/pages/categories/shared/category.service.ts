import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap, retry } from 'rxjs/operators';

import { Category } from './category.model';
import { element } from 'protractor';
import { BaseResourcesService } from '../../../shared/services/base-resources.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseResourcesService<Category> {

  constructor(protected injector: Injector) {
    super('api/categories', injector);
  }
}
