import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatContentPipe } from '../../pipes/format-content.pipe';
import { Page } from '../../models/page.model';
import { PageService } from '../../services/page.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CmsService } from '../../services/cms.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of, combineLatest, map } from 'rxjs';
import { EditPageDialogComponent } from '../edit-dialogs/edit-page-dialog.component';

@Component({
  selector: 'app-page-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, FormatContentPipe],
  template: `
    <div *ngIf="page$ | async as page" class="page-container" [ngStyle]="getLayoutStyles(page)">

      <div class="page-header">
        <h1>{{ page.name }}</h1>
        <button mat-icon-button *ngIf="canEdit$ | async" (click)="editPage(page)">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button color="warn" *ngIf="(canEdit$ | async) && !nested" (click)="deletePage(page)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <img *ngIf="page.imageUrl" [src]="page.imageUrl" alt="Page Image" class="page-image" />

      <div class="page-content" [innerHTML]="page.content | formatContent">
      </div>

      <!-- Render child pages recursively if showOnParent is true -->
      <ng-container *ngIf="childPages$ | async as children">
        <div class="child-pages" *ngIf="children.length > 0">
           <!-- Using recursive component call -->
           <app-page-view *ngFor="let child of children" [pageId]="child.id" [nested]="true"></app-page-view>
        </div>
      </ng-container>

      <button mat-stroked-button color="primary" *ngIf="(canEdit$ | async) && !nested" (click)="addChildPage(page)">
        <mat-icon>add</mat-icon> Add Child Page
      </button>

    </div>
  `,
  styles: [`
    .page-container { margin-bottom: 30px; padding: 10px; }
    .page-header { display: flex; align-items: center; gap: 10px; }
    .page-image { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px; }
    .page-content { white-space: pre-wrap; font-size: 1.1rem; line-height: 1.6; }
    .child-pages { margin-left: 20px; border-left: 2px solid #ccc; padding-left: 15px; margin-top: 20px; }
  `]
})
export class PageViewComponent implements OnInit, OnChanges {
  private pageService = inject(PageService);
  private auth = inject(AuthService);
  cms = inject(CmsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @Input() pageId?: string;
  @Input() nested: boolean = false;

  page$: Observable<Page | null> = of(null);
  childPages$: Observable<Page[]> = of([]);

  canEdit$: Observable<boolean> = combineLatest([
    this.auth.userProfile$,
    this.cms.currentSite$
  ]).pipe(
    map(([user, site]) => {
      if (!user || !site) return false;
      return user.role?.isAdmin || user.role?.siteGroups?.includes(site.id!) || false;
    })
  );

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageId'] && this.pageId) {
      this.page$ = this.cms.allPages$.pipe(
        map(pages => pages.find(p => p.id === this.pageId) || null)
      );
      this.childPages$ = this.cms.getChildPages(this.pageId).pipe(
          map(children => children.filter(c => c.showOnParent))
      );
    }
  }

  getLayoutStyles(page: Page) {
    const site = this.cms.getCurrentSite();
    const siteLayout = site?.layoutOptions || {};
    const pageLayout = page.layoutOptions || {};

    // Merge layouts: Page overrides Site
    return {
      'text-align': pageLayout.fontAlignment || siteLayout.fontAlignment || 'left',
      'font-family': pageLayout.fontFamily || siteLayout.fontFamily || 'inherit',
    };
  }

  editPage(page: Page) {
    const site = this.cms.getCurrentSite();
    if (!site?.id) return;

    const dialogRef = this.dialog.open(EditPageDialogComponent, {
      width: '600px',
      data: { page: { ...page }, siteId: site.id }
    });

    dialogRef.afterClosed().subscribe(async (result: Partial<Page>) => {
      if (result && page.id) {
        try {
          // Firebase update
          await this.pageService.updatePage(site.id!, page.id, result);

          // Local update after success
          this.cms.updatePageInStore(page.id, result);
          
          this.snackBar.open('Page updated successfully', 'Close', { duration: 3000 });
        } catch (error) {
          console.error('Error updating page:', error);
          this.snackBar.open('Error updating page. Syncing...', 'Close', { duration: 5000 });
          this.cms.reloadPages(); // Sync/Rollback
        }
      }
    });
  }

  addChildPage(parentPage: Page) {
    const site = this.cms.getCurrentSite();
    if (!site?.id) return;

    const dialogRef = this.dialog.open(EditPageDialogComponent, {
      width: '600px',
      data: { siteId: site.id, parentId: parentPage.id }
    });

    dialogRef.afterClosed().subscribe(async (result: Partial<Page>) => {
      if (result) {
        const newPage: Page = {
          ...result as Page,
          parentPageId: parentPage.id
        };
        
        try {
          // Firebase call first to get the generated ID
          const createdPage = await this.pageService.createPage(site.id!, newPage);
          
          // Local update
          this.cms.addPageToStore(createdPage);
          this.snackBar.open('Child page added successfully', 'Close', { duration: 3000 });
        } catch (error) {
          console.error('Error adding child page:', error);
          this.snackBar.open('Error adding child page.', 'Close', { duration: 5000 });
          this.cms.reloadPages(); // Rollback/Sync
        }
      }
    });
  }

  async deletePage(page: Page) {
     const site = this.cms.getCurrentSite();
     if (!site?.id) return;

     if(confirm(`Are you sure you want to delete ${page.name}?`)) {
         if (page.id) {
             try {
                // Firebase update
                await this.pageService.deletePage(site.id, page.id);

                // Local update after success
                this.cms.removePageFromStore(page.id);
                
                this.snackBar.open('Page deleted successfully', 'Close', { duration: 3000 });
             } catch (error) {
                console.error('Error deleting page:', error);
                this.snackBar.open('Error deleting page. Syncing...', 'Close', { duration: 5000 });
                this.cms.reloadPages(); // Sync/Rollback
             }
         }
     }
  }
}
