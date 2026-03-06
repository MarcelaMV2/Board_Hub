import { Component, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './client-form.html',
})
export class ClientFormComponent implements OnChanges {
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() clientData: any | null = null;
  @Input() formType: 'create' | 'edit' = 'create';

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

  ngOnChanges(changes: any) {
    if (changes.clientData) {
      if (this.clientData) {
        this.form.patchValue({
          fullName: this.clientData.fullName,
          dni: this.clientData.dni,
          telefono: this.clientData.telefono,
          email: this.clientData.email,
        });
        this.previewUrl = this.clientData.perfil || null;
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
