import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageViewComponent } from '../page-view/page-view.component';
import { CmsService } from '../../services/cms.service';
import { AuthService } from '../../services/auth.service';
import { PageService } from '../../services/page.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EditPageDialogComponent } from '../edit-dialogs/edit-page-dialog.component';
import { Page } from '../../models/page.model';
import { map, combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-page-route',
  standalone: true,
  imports: [CommonModule, PageViewComponent, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <app-page-view *ngIf="pageId" [pageId]="pageId"></app-page-view>

    <div *ngIf="!pageId" class="select-prompt">
      <div *ngIf="(cms.navigationPages$ | async)?.length; else noPages">
        <h2>Select a page from navigation</h2>
      </div>
      <ng-template #noPages>
        <h2>No pages found for this site.</h2>
      </ng-template>

      <!-- Create Root Page Button -->
      <button mat-raised-button color="primary" *ngIf="canEditSite$ | async" (click)="createRootPage()">
        <mat-icon>add</mat-icon> Create First/Root Page
      </button>
    </div>
  `,
  styles: [`
    .select-prompt { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 50vh; color: #666; gap: 20px;}
  `]
})
export class PageRouteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  cms = inject(CmsService);
  auth = inject(AuthService);
  pageService = inject(PageService);
  dialog = inject(MatDialog);

  pageId?: string;
  canEditSite$: Observable<boolean>;

  constructor() {
    this.canEditSite$ = combineLatest([this.auth.userProfile$, this.cms.currentSite$]).pipe(
      map(([user, site]) => {
        if (!user || !site) return false;
        return user.role?.isAdmin || user.role?.siteGroups?.includes(site.id!) || false;
      })
    );
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageId = params.get('id') || undefined;
    });
  }

  createRootPage() {
    const site = this.cms.getCurrentSite();
    if (!site || !site.id) return;

    const dialogRef = this.dialog.open(EditPageDialogComponent, {
      width: '600px',
      data: { siteId: site.id } // No parentId means it's a root page
    });

    dialogRef.afterClosed().subscribe(async (result: Partial<Page>) => {
      if (result) {
        const newPage: Page = {
          ...result as Page,
          parentPageId: '' // Explicitly root
        };
        const newPageId = await this.pageService.createPage(newPage);

        // Reload navigation
        await this.cms.loadNavigationPages(site.id!);

        // Navigate to the newly created page
        this.router.navigate(['/page', newPageId]);
      }
    });
  }
}
