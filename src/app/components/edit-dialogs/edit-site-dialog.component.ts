import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Site } from '../../models/site.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-site-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.site ? 'Edit Site' : 'New Site' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="siteForm" class="edit-form">
        <mat-form-field appearance="fill">
          <mat-label>Site Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Site URL (e.g., localhost or mydomain.com)</mat-label>
          <input matInput formControlName="url" required>
        </mat-form-field>

        <h3>Default Layout Options</h3>
        <div formGroupName="layoutOptions">
          <mat-form-field appearance="fill">
            <mat-label>Primary Color</mat-label>
            <input matInput type="color" formControlName="primaryColor">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Accent Color</mat-label>
            <input matInput type="color" formControlName="accentColor">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Font Family</mat-label>
            <input matInput formControlName="fontFamily" placeholder="e.g. Roboto, Arial">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Font Alignment</mat-label>
            <mat-select formControlName="fontAlignment">
              <mat-option value="left">Left</mat-option>
              <mat-option value="center">Center</mat-option>
              <mat-option value="right">Right</mat-option>
              <mat-option value="justify">Justify</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!siteForm.valid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .edit-form { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
    h3 { margin-top: 20px; margin-bottom: 10px; font-size: 1.1em; color: #555; }
  `]
})
export class EditSiteDialogComponent {
  private fb = inject(FormBuilder);

  siteForm = this.fb.group({
    name: [this.data.site?.name || '', Validators.required],
    url: [this.data.site?.url || 'localhost', Validators.required],
    layoutOptions: this.fb.group({
      primaryColor: [this.data.site?.layoutOptions?.primaryColor || '#3f51b5'],
      accentColor: [this.data.site?.layoutOptions?.accentColor || '#ff4081'],
      fontFamily: [this.data.site?.layoutOptions?.fontFamily || 'Roboto, sans-serif'],
      fontAlignment: [this.data.site?.layoutOptions?.fontAlignment || 'left']
    })
  });

  constructor(
    public dialogRef: MatDialogRef<EditSiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { site?: Site }
  ) {}

  save() {
    if (this.siteForm.valid) {
      const formValue = this.siteForm.value;
      const updatedSite: Site = {
        name: formValue.name!,
        url: formValue.url!,
        layoutOptions: {
          primaryColor: formValue.layoutOptions?.primaryColor || '',
          accentColor: formValue.layoutOptions?.accentColor || '',
          fontFamily: formValue.layoutOptions?.fontFamily || '',
          fontAlignment: (formValue.layoutOptions?.fontAlignment as 'left'|'center'|'right'|'justify') || 'left'
        }
      };

      this.dialogRef.close(updatedSite);
    }
  }
}
