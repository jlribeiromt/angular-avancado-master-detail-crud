import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../shared/entry.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from '../shared/entry.model';
import { PrimeNGConfig } from 'primeng/api/primengconfig';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css'],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ',',
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    today: 'Hoje',
    clear: 'Limpar',
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryServe: CategoryService
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntry();
    this.loadEntry();
    this.loadCategories();
    console.log(this.typeOptions);
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return {
        text: text,
        value: value,
      };
    });
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createEntry();
    } else {
      // currentAction = edit
      this.updateEntry();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.entryForm.controls;
  }

  // PRIVATE METHODS
  private setCurrentAction(): void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntry(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry(): void {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => this.entryService.getById(+params.get('id')))
        )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry); // binds loaded entry data to EntryForm
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
        );
    }
  }

  private loadCategories() {
    this.categoryServe
      .getAll()
      .subscribe((categories) => (this.categories = categories));
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private createEntry(): void {
    const entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionForError(error)
    );
  }

  private updateEntry(): void {
    const entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionForError(error)
    );
  }

  private actionsForSuccess(entry: Entry): void {
    toastr.success('Solicitação processada com sucesso!');

    // redirect/reload component page
    this.router
      .navigateByUrl('entries', { skipLocationChange: true })
      .then(() => this.router.navigate(['entries', entry.id, 'edit']));
  }

  private actionForError(error): void {
    toastr.error('Ocorreu um erro ao processar a sua solicitação.!');
    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = [
        'Falha na comunicação com servidor. Por favor tente mais tarde.',
      ];
    }
  }
  compareFn(option1,option2): boolean {
    return option1.type=option2.type;
}
}
