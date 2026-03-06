import { Component, EventEmitter, OnInit, Output, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../services/category/category';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './game-form.html',
})
export class GameFormComponent implements OnInit, OnChanges {
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() gameData: any | null = null;
  @Input() formType: 'create' | 'edit' = 'create';

  form: FormGroup;
  categories: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      idCategory: ['', Validators.required],
      description: ['', Validators.required],
      minPlayers: [null, [Validators.required, Validators.min(1)]],
      maxPlayers: [null, [Validators.required, Validators.min(1)]],
      durationGame: [null, Validators.required],
      stockTotal: [null, [Validators.required, Validators.min(1)]],
      priceDay: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log('Categorias:', data);
        this.categories = data;
      },
      error: (err) => console.error(err),
    });
  }

  ngOnChanges(changes: any) {
    if (changes.gameData) {
      if (this.gameData) {
        this.form.patchValue({
          title: this.gameData.title,
          idCategory: this.gameData.category.id,
          description: this.gameData.description,
          minPlayers: this.gameData.minPlayers,
          maxPlayers: this.gameData.maxPlayers,
          durationGame: this.gameData.durationGame,
          stockTotal: this.gameData.stockTotal,
          priceDay: this.gameData.priceDay,
        });
        this.previewUrl = this.gameData.image || null;
      } else {
        this.form.reset();
        this.previewUrl = null;
        this.selectedFile = null;
      }
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log('Form value:', this.form.value);
    console.log('Form valid:', this.form.valid);
    console.log('idCategory value:', this.form.get('idCategory')?.value);
    if (this.form.invalid) return;
    this.submitForm.emit({ ...this.form.value, file: this.selectedFile });
  }
}
