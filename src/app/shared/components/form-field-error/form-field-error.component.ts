import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;
  constructor(

  ) { }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
   get errors() {
     return this.formControl.errors;
   }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return  this.getErrorMessage();
    }
    else {
      return null;
    }
  }

  private mustShowErrorMessage(): boolean{
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.errors.required) {
      return 'dado obrigatório';
    }
    else if (this.errors.email) {
      return 'formato de e-mail inválido';
    }
    else if (this.errors.minlength) {
      const requiredLength = this.errors.minlength.requiredLength;
      return `deve ter no mínimo ${requiredLength} caracteres`;
    }
    else if (this.errors.maxlength) {
      const requiredLength = this.errors.maxlength.requiredLength;
      return `deve ter no maxímo ${requiredLength} caracteres`;
    }
  }
}
