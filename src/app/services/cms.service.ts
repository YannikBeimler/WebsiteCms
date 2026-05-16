import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Site } from '../models/site.model';
import { Page } from '../models/page.model';
import { SiteService } from './site.service';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private siteService = inject(SiteService);
  private pageService = inject(PageService);

  private currentSiteSubject = new BehaviorSubject<Site | null>(null);
  currentSite$ = this.currentSiteSubject.asObservable();

  private allPagesSubject = new BehaviorSubject<Page[]>([]);
  allPages$ = this.allPagesSubject.asObservable();

  private activePageIdSubject = new BehaviorSubject<string | null>(null);
  activePageId$ = this.activePageIdSubject.asObservable();

  navigationPages$ = this.allPages$.pipe(
    map(pages => pages.filter(p => !p.parentPageId && p.showInNavigation))
  );

  currentPage$ = combineLatest([this.allPages$, this.activePageId$]).pipe(
    map(([pages, activeId]) => pages.find(p => p.id === activeId) || null)
  );

  async loadSiteByUrl(url: string) {
    const site = await this.siteService.getSiteByUrl(url);
    this.currentSiteSubject.next(site);
    if (site && site.id) {
      await this.reloadPages();
    } else {
      this.allPagesSubject.next([]);
    }
  }

  async reloadPages() {
    const site = this.currentSiteSubject.value;
    if (site && site.id) {
      const allPages = await this.pageService.getPagesForSite(site.id);
      this.allPagesSubject.next(allPages);
    }
  }

  setActivePage(pageId: string | null) {
    this.activePageIdSubject.next(pageId);
  }

  getChildPages(parentId: string): Observable<Page[]> {
    return this.allPages$.pipe(
      map(pages => pages.filter(p => p.parentPageId === parentId))
    );
  }

  getCurrentSite(): Site | null {
    return this.currentSiteSubject.value;
  }
}
