import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryForm implements OnChanges {
  @Input() category: Category | null = null;
  @Output() submitForm = new EventEmitter<{ id?: string; name: string; description: string }>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      if (this.category) {
        this.form.patchValue({
          name: this.category.name,
          description: this.category.description,
        });
      } else {
        this.form.reset();
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    this.submitForm.emit({
      id: this.category?.id,
      name: formValue.name,
      description: formValue.description,
    })
  }

  onCancel(){
    this.cancel.emit();
  }
}
