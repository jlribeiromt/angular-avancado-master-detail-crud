import {
  OnInit,
  AfterContentChecked,
  Injector,
  Directive,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resources.model';
import { BaseResourcesService } from '../../services/base-resources.service';

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel>
  implements OnInit, AfterContentChecked {
  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourcesService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createResource();
    } else {
      // currentAction = edit
      this.updateResource();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resourceForm.controls;
  }

  // PRIVATE METHODS
  protected setCurrentAction(): void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource(): void {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => this.resourceService.getById(+params.get('id')))
        )
        .subscribe(
          (resource) => {
            this.resource = resource;
            this.resourceForm.patchValue(resource); // binds loaded resource data to resourceForm
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
        );
    }
  }

  protected setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return "Novo";
  }

  protected editionPageTitle(): string {
    return "Edição";
  }

  protected createResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource).subscribe(
      (resource) => this.actionsForSuccess(resource),
      (error) => this.actionForError(error)
    );
  }

  protected updateResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource).subscribe(
      (resource) => this.actionsForSuccess(resource),
      (error) => this.actionForError(error)
    );
  }

  protected actionsForSuccess(resource: T): void {
    toastr.success('Solicitação processada com sucesso!');

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    // redirect/reload component page
    this.router
      .navigateByUrl('categories', { skipLocationChange: true })
      .then(() => this.router.navigate([baseComponentPath, resource.id, 'edit']));
  }

  protected actionForError(error): void {
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

  protected abstract buildResourceForm(): void;

}
