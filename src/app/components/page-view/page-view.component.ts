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
import { BehaviorSubject } from 'rxjs';
import { EditPageDialogComponent } from '../edit-dialogs/edit-page-dialog.component';

@Component({
  selector: 'app-page-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, FormatContentPipe],
  template: `
    <div *ngIf="page$ | async as page" class="page-container" [ngStyle]="getLayoutStyles(page)">

      <div class="page-header">
        <h1>{{ page.name }}</h1>
        <button mat-icon-button *ngIf="canEdit()" (click)="editPage(page)">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button color="warn" *ngIf="canEdit() && !nested" (click)="deletePage(page)">
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

      <button mat-stroked-button color="primary" *ngIf="canEdit() && !nested" (click)="addChildPage(page)">
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
  private cms = inject(CmsService);
  private dialog = inject(MatDialog);

  @Input() pageId?: string;
  @Input() nested: boolean = false;

  private pageSubject = new BehaviorSubject<Page | null>(null);
  page$ = this.pageSubject.asObservable();

  private childPagesSubject = new BehaviorSubject<Page[]>([]);
  childPages$ = this.childPagesSubject.asObservable();

  canEditUser: boolean = false;

  ngOnInit() {
    this.auth.userProfile$.subscribe(() => {
        this.canEditUser = this.checkCanEdit();
    });
    this.cms.currentSite$.subscribe(() => {
        this.canEditUser = this.checkCanEdit();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageId'] && this.pageId) {
      this.loadPage(this.pageId);
    }
  }

  async loadPage(id: string) {
    const page = await this.pageService.getPageById(id);
    this.pageSubject.next(page);

    if (page) {
      this.loadChildren(id);
    }
  }

  async loadChildren(parentId: string) {
    const children = await this.pageService.getChildPages(parentId);
    // Only show children that have showOnParent true if we are rendering them nested
    const visibleChildren = children.filter(c => c.showOnParent);
    this.childPagesSubject.next(visibleChildren);
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

  canEdit(): boolean {
    return this.canEditUser;
  }

  private checkCanEdit(): boolean {
      // Temporary synchronous workaround for role checking inside template without excessive async pipes
      let isAllowed = false;
      this.auth.userProfile$.subscribe(user => {
          this.cms.currentSite$.subscribe(site => {
               if (user && site) {
                   isAllowed = user.role?.isAdmin || user.role?.siteGroups?.includes(site.id!) || false;
               } else {
                   isAllowed = false;
               }
          }).unsubscribe();
      }).unsubscribe();
      return isAllowed;
  }

  editPage(page: Page) {
    const site = this.cms.getCurrentSite();
    if (!site?.id) return;

    const dialogRef = this.dialog.open(EditPageDialogComponent, {
      width: '600px',
      data: { page: page, siteId: site.id }
    });

    dialogRef.afterClosed().subscribe(async (result: Partial<Page>) => {
      if (result && page.id) {
        await this.pageService.updatePage(page.id, result);
        this.loadPage(page.id); // Reload
        if (result.showInNavigation !== page.showInNavigation) {
             this.cms.loadNavigationPages(site.id!);
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
        await this.pageService.createPage(newPage);
        this.loadChildren(parentPage.id!); // Reload children
      }
    });
  }

  async deletePage(page: Page) {
     const site = this.cms.getCurrentSite();
     if (!site?.id) return;

     if(confirm(`Are you sure you want to delete ${page.name}?`)) {
         if (page.id) {
             await this.pageService.deletePage(page.id);
             this.cms.loadNavigationPages(site.id);
             // If we delete the currently viewed page, we should probably navigate away
         }
     }
  }
}
