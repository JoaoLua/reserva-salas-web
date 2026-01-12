import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MATERIAL_MODULES } from 'src/app/shared/material/material.imports';

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, ...MATERIAL_MODULES],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roomName: string, time: string }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      by: ['', [Validators.required, Validators.minLength(3)]],
      reason: ['', Validators.maxLength(100)]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}