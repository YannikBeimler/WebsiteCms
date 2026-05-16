import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CmsService } from '../../services/cms.service';
import { AuthService } from '../../services/auth.service';
import { SiteService } from '../../services/site.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { map, combineLatest, Observable } from 'rxjs';
import { EditSiteDialogComponent } from '../edit-dialogs/edit-site-dialog.component';
import { EditPageDialogComponent } from '../edit-dialogs/edit-page-dialog.component';
import { Site } from '../../models/site.model';
import { Page } from '../../models/page.model';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule, MatTooltipModule],
  template: `
    <div [ngStyle]="getLayoutStyles()" class="app-container">
      <mat-toolbar [color]="getToolbarColor()">
        <span>{{ (cms.currentSite$ | async)?.name || 'Welcome to WebsiteCms' }}</span>
        <span class="spacer"></span>

        <nav class="navigation">
          <a mat-button *ngFor="let page of (cms.navigationPages$ | async)"
             [routerLink]="['/page', page.id]">
            {{ page.name }}
          </a>
        </nav>

        <span class="spacer"></span>

        <!-- Admin / Auth Area -->
        <ng-container *ngIf="auth.userProfile$ | async as user; else loginBtn">
          <!-- Add Root Page Button -->
          <button mat-icon-button *ngIf="canEditSite$ | async" (click)="addRootPage()" matTooltip="Add Root Page">
            <mat-icon>post_add</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="auth.logout()">Logout</button>
          </mat-menu>
        </ng-container>
        <ng-template #loginBtn>
          <a mat-button routerLink="/login">Login</a>
        </ng-template>

        <!-- Edit Site Icon -->
        <button mat-icon-button *ngIf="canEditSite$ | async" (click)="editSite()">
          <mat-icon>settings</mat-icon>
        </button>
      </mat-toolbar>

      <main class="content">
        <!-- Always show router outlet so we can get to login regardless of site state -->
        <router-outlet *ngIf="isSiteLoaded"></router-outlet>

        <div class="no-site-container" *ngIf="!isSiteLoaded">
           <h2>No site found for this URL.</h2>
           <p>Would you like to create one?</p>
           <ng-container *ngIf="auth.userProfile$ | async; else promptLogin">
               <button mat-raised-button color="primary" (click)="createSite()">Create New Site</button>
           </ng-container>
           <ng-template #promptLogin>
               <p><a routerLink="/login">Login</a> to create a site.</p>
           </ng-template>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container { min-height: 100vh; display: flex; flex-direction: column; }
    .spacer { flex: 1 1 auto; }
    .navigation { display: flex; gap: 10px; margin: 0 20px; }
    .content { padding: 20px; flex: 1; }
    .no-site-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; text-align: center; gap: 20px; }
  `]
})
export class ShellComponent implements OnInit {
  cms = inject(CmsService);
  auth = inject(AuthService);
  siteService = inject(SiteService);
  pageService = inject(PageService);
  dialog = inject(MatDialog);
  router = inject(Router);

  canEditSite$: Observable<boolean>;
  currentHostUrl = 'localhost';
  isSiteLoaded = true; // Assume loaded until we know it's not

  constructor() {
    this.canEditSite$ = combineLatest([this.auth.userProfile$, this.cms.currentSite$]).pipe(
      map(([user, site]) => {
        if (!user || !site) return false;
        return user.role?.isAdmin || user.role?.siteGroups?.includes(site.id!) || false;
      })
    );
  }

  ngOnInit() {
    this.currentHostUrl = window.location.hostname || 'localhost';

    // Subscribe to site loading to update UI state
    this.cms.currentSite$.subscribe(site => {
       // Only hide main content if we definitely know there is no site
       // and we aren't trying to log in (which is handled via router outlet)
       if (!site && this.router.url !== '/login') {
          this.isSiteLoaded = false;
       } else {
          this.isSiteLoaded = true;
       }
    });

    this.cms.loadSiteByUrl(this.currentHostUrl);
  }

  getToolbarColor() {
    return 'primary';
  }

  getLayoutStyles() {
    const site = this.cms.getCurrentSite();
    if (!site?.layoutOptions) return {};

    return {
      '--primary-color': site.layoutOptions.primaryColor || '#3f51b5',
      '--accent-color': site.layoutOptions.accentColor || '#ff4081',
      'font-family': site.layoutOptions.fontFamily || 'Roboto, sans-serif'
    };
  }

  createSite() {
      const dialogRef = this.dialog.open(EditSiteDialogComponent, {
          width: '500px',
          data: { site: { url: this.currentHostUrl } } // Pre-fill current URL
      });

      dialogRef.afterClosed().subscribe(async (result: Site) => {
          if (result) {
              await this.siteService.createSite(result);
              // Reload the site after creation
              await this.cms.loadSiteByUrl(this.currentHostUrl);
              this.router.navigate(['/']); // Navigate to home
          }
      });
  }

  editSite() {
      const currentSite = this.cms.getCurrentSite();
      if (!currentSite) return;

      const dialogRef = this.dialog.open(EditSiteDialogComponent, {
          width: '500px',
          data: { site: currentSite }
      });

      dialogRef.afterClosed().subscribe(async (result: Site) => {
          if (result && currentSite.id) {
              await this.siteService.updateSite(currentSite.id, result);
              await this.cms.loadSiteByUrl(this.currentHostUrl);
          }
      });
  }

  addRootPage() {
      const currentSite = this.cms.getCurrentSite();
      if (!currentSite || !currentSite.id) return;

      const dialogRef = this.dialog.open(EditPageDialogComponent, {
          width: '600px',
          data: { siteId: currentSite.id }
      });

      dialogRef.afterClosed().subscribe(async (result: Partial<Page>) => {
          if (result) {
              const newPage: Page = {
                  ...result as Page,
                  parentPageId: ''
              };
              const newPageId = await this.pageService.createPage(currentSite.id!, newPage);
              await this.cms.loadNavigationPages(currentSite.id!);
              this.router.navigate(['/page', newPageId]);
          }
      });
  }
}
