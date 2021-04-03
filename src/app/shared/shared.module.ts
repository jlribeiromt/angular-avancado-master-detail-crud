import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    // shared modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class SharedModule { }
