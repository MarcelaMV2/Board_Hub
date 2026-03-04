import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryForm {
  @Output() submitForm = new EventEmitter<{ name: string; description: string }>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
      this.form.reset();
    }
  }
}
