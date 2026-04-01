import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Page } from '../../models/page.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-page-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.page ? 'Edit Page' : 'New Page' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="pageForm" class="edit-form">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Content</mat-label>
          <textarea matInput formControlName="content" rows="6" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Image URL (Optional)</mat-label>
          <input matInput formControlName="imageUrl">
        </mat-form-field>

        <div class="checkboxes">
          <mat-checkbox formControlName="showOnParent">Show On Parent</mat-checkbox>
          <mat-checkbox formControlName="showInNavigation">Show In Navigation</mat-checkbox>
        </div>

        <mat-form-field appearance="fill">
          <mat-label>Sort Number</mat-label>
          <input matInput type="number" formControlName="sortNumber">
        </mat-form-field>

        <h3>Layout Options (Overrides Site Defaults)</h3>
        <div formGroupName="layoutOptions">
          <mat-form-field appearance="fill">
            <mat-label>Primary Color</mat-label>
            <input matInput type="color" formControlName="primaryColor">
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
      <button mat-raised-button color="primary" [disabled]="!pageForm.valid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .edit-form { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
    .checkboxes { display: flex; gap: 20px; margin-bottom: 15px; }
    h3 { margin-top: 20px; margin-bottom: 10px; font-size: 1.1em; color: #555; }
  `]
})
export class EditPageDialogComponent {
  private fb = inject(FormBuilder);

  pageForm = this.fb.group({
    name: [this.data.page?.name || '', Validators.required],
    content: [this.data.page?.content || '', Validators.required],
    imageUrl: [this.data.page?.imageUrl || ''],
    showOnParent: [this.data.page?.showOnParent || false],
    showInNavigation: [this.data.page?.showInNavigation || false],
    sortNumber: [this.data.page?.sortNumber || 0, Validators.required],
    layoutOptions: this.fb.group({
      primaryColor: [this.data.page?.layoutOptions?.primaryColor || ''],
      fontAlignment: [this.data.page?.layoutOptions?.fontAlignment || 'left']
    })
  });

  constructor(
    public dialogRef: MatDialogRef<EditPageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { page?: Page, siteId: string, parentId?: string }
  ) {}

  save() {
    if (this.pageForm.valid) {
      const formValue = this.pageForm.value;
      const updatedPage: Partial<Page> = {
        name: formValue.name!,
        content: formValue.content!,
        imageUrl: formValue.imageUrl || '',
        showOnParent: formValue.showOnParent!,
        showInNavigation: formValue.showInNavigation!,
        sortNumber: formValue.sortNumber!,
        layoutOptions: {
          primaryColor: formValue.layoutOptions?.primaryColor || '',
          fontAlignment: (formValue.layoutOptions?.fontAlignment as 'left'|'center'|'right'|'justify') || 'left'
        }
      };

      this.dialogRef.close(updatedPage);
    }
  }
}
