import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { CategoryService } from '../../services/category/category';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';
import { Modal } from '../../components/shared/modal/modal';
import { ModalLayout } from '../../components/shared/modal-layout/modal-layout';
import { CategoryForm } from './category-form/category-form';
import { DataTable } from '../../components/shared/data-table/data-table';

@Component({
  selector: 'app-categories',
  imports: [PageHeader, Modal, ModalLayout, CategoryForm, SearchInput, DropdownMenu],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories implements OnInit {
  categories: { name: string; description: string }[] = [];
  categoryColumns = ['index', 'name', 'description', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  isCreateCategoryOpen = false;
  openModalCategory() {
    this.isCreateCategoryOpen = true;
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log('DATA:', data);
        this.categories = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.log(err),
    });
  }

  onSearch(term: string) {
    // filtrar tabla después
  }
  /* createCategory(data: { name: string; description: string }) {
    this.categoryService.createCategory(data.name, data.description).subscribe({
      next: (res) => {
        console.log('Categoría creada:', res);
        this.isCreateCategoryOpen = false;
        // actualizar la lista
        this.categoryService.getCategories().subscribe((cats) => {
          this.categories = cats;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('Error creando categoría:', err);
      },
    });
  } */
  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.cdr.markForCheck();
    });
  }

  /* createCategory(data: { name: string; description: string }) {
    this.categoryService.createCategory(data.name, data.description).subscribe({
      next: () => {
        this.isCreateCategoryOpen = false;
        this.loadCategories();
      },
      error: (err) => console.error('Error creando categoría:', err),
    });
  } */

  createCategory(data: { name: string; description: string }) {
    const tempCat = { name: data.name, description: data.description };

    // Agregar inmediatamente al array local
    this.categories = [...this.categories, tempCat];

    this.categoryService.createCategory(data.name, data.description).subscribe({
      next: () => {
        this.isCreateCategoryOpen = false;
        // opcional: refrescar desde backend si quieres asegurar sincronización
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error creando categoría:', err);
        // remover temporal si falla
        this.categories = this.categories.filter((c) => c !== tempCat);
      },
    });
  }

  editCategory(cat: string) {}

  deleteCategory(id: string) {}
}
