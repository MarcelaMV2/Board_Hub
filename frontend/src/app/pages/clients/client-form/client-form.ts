import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './client-form.html',
})
export class ClientFormComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.selectedFile = file;

      // Preview de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const data = { ...this.form.value, file: this.selectedFile };
    this.submitForm.emit(data);
  }
}
