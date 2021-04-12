import { Directive, OnInit } from '@angular/core';
import { BaseResourcesService } from '../../services/base-resources.service';
import { BaseResourceModel } from '../../models/base-resources.model';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {
  resources: T[] = [];

  constructor(private resourceService: BaseResourcesService<T>) {}

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(
      (resources) => (this.resources = resources.sort((a, b) => b.id - a.id)),
      (error) => alert('Erro ao carregar a lista')
    );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () =>
          (this.resources = this.resources.filter(
            (element) => element !== resource
          )),
        () => alert('Erro ao tentar excluir!')
      );
    }
  }
}
