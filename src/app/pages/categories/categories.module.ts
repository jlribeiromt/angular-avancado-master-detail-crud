import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
