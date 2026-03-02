import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { CategoryService } from '../../services/category/category';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-categories',
  imports: [PageHeader, SearchInput, DropdownMenu],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories implements OnInit {
  categories: { name: string; description: string }[] = [];

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

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
  openModalCategory() {}

  onSearch(term: string) {
    // filtrar tabla después
  }

  editCategory(cat: string) {}

  deleteCategory(id: string) {}
}
