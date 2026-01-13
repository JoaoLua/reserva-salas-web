import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MATERIAL_MODULES } from 'src/app/shared/material/material.imports';

export interface ReservaData {
  roomId: string;
  roomName: string;
  time: string;
}

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, ...MATERIAL_MODULES],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {

  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ReservaComponent>);
  public data: ReservaData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

ngOnInit(): void {
    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.maxLength(100)]]
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