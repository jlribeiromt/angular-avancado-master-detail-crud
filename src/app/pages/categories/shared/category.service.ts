import { Injectable, Injector } from '@angular/core';
import { Category } from './category.model';
import { BaseResourcesService } from '../../../shared/services/base-resources.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseResourcesService<Category> {

  constructor(protected injector: Injector) {
    super('api/categories', injector, Category.fromJson);
  }
}
