import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  private navigationPagesSubject = new BehaviorSubject<Page[]>([]);
  navigationPages$ = this.navigationPagesSubject.asObservable();

  async loadSiteByUrl(url: string) {
    const site = await this.siteService.getSiteByUrl(url);
    this.currentSiteSubject.next(site);
    if (site && site.id) {
       await this.loadNavigationPages(site.id);
    } else {
       this.navigationPagesSubject.next([]);
    }
  }

  async loadNavigationPages(siteId: string) {
    const rootPages = await this.pageService.getRootPagesForSite(siteId);
    const navPages = rootPages.filter(p => p.showInNavigation);
    this.navigationPagesSubject.next(navPages);
  }

  getCurrentSite(): Site | null {
    return this.currentSiteSubject.value;
  }
}
