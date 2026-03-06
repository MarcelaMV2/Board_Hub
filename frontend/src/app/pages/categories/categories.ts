import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category/category';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';
import { Modal } from '../../components/shared/modal/modal';
import { ModalLayout } from '../../components/shared/modal-layout/modal-layout';
import { CategoryForm } from './category-form/category-form';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { ColumnDef, DataTable } from '../../components/shared/data-table/data-table';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [Modal, ModalLayout, CategoryForm, PageHeader, SearchInput, DataTable],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  categories = signal<Category[]>([]);
  searchTerm = signal('');
  isModalOpen = signal(false);
  selectedCategory = signal<Category | null>(null);
  isLoading = signal(false);

  categoryColumns: ColumnDef[] = [
    { key: 'index', label: 'N', type: 'index' },
    { key: 'name', label: 'Nombre', type: 'text' },
    { key: 'description', label: 'Descripción', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    console.log('FILTER EXECUTADO', term);
    if (!term) return this.categories();

    return this.categories().filter((categoria) => categoria.name.toLowerCase().includes(term));
  });

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.isLoading.set(false);
      },
    });
  }

  openModalCategory() {
    this.selectedCategory.set(null); // modo crear
    this.isModalOpen.set(true);
  }

  openCreateModal() {
    this.selectedCategory.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(row: any) {
    this.selectedCategory.set(row);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  onSearch(term: string) {
    console.log('BUSCANDO:', term);
    this.searchTerm.set(term);
  }

  saveCategory(data: { id?: string; name: string; description: string }) {
    // update category
    if (data.id) {
      this.categoryService.updateCategory(data.id, data.name, data.description).subscribe({
        next: () => {
          this.categories.update((prev) =>
            prev.map((cat) =>
              cat.id === data.id ? { ...cat, name: data.name, description: data.description } : cat,
            ),
          );
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando categoría', err),
      });

      return;
    }

    // create category
    this.categoryService.createCategory(data.name, data.description).subscribe({
      next: (newCategory: Category) => {
        this.categories.update((prev) => [...prev, newCategory]);
        this.closeModal();
      },
      error: (err) => console.error('Error creando categoría', err),
    });
  }

  deleteCategory(row: any) {
    this.categoryService.deleteCategory(row.id).subscribe({
      next: () => {
        this.categories.update((prev) => prev.filter((cat) => cat.id !== row.id));
      },
      error: (err) => console.error('Error eliminando categoría', err),
    });
  }
  editCategory(data: string) {}
}
