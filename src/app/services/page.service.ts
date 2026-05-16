import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private firestore: Firestore = inject(Firestore);

  async getPagesForSite(siteId: string): Promise<Page[]> {
    const pagesCollection = collection(this.firestore, `sites/${siteId}/pages`);
    const q = query(pagesCollection, orderBy('sortNumber'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  }

  async getRootPagesForSite(siteId: string): Promise<Page[]> {
      const pagesCollection = collection(this.firestore, `sites/${siteId}/pages`);
      // Use empty string for root pages
      const q = query(pagesCollection, where('parentPageId', '==', ''), orderBy('sortNumber'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  }

  async getPageById(siteId: string, id: string): Promise<Page | null> {
    const pageDoc = doc(this.firestore, `sites/${siteId}/pages`, id);
    const docSnap = await getDoc(pageDoc);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Page : null;
  }

  async getChildPages(siteId: string, parentId: string): Promise<Page[]> {
    const pagesCollection = collection(this.firestore, `sites/${siteId}/pages`);
    const q = query(pagesCollection, where('parentPageId', '==', parentId), orderBy('sortNumber'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  }

  async createPage(siteId: string, page: Page): Promise<string> {
    const pagesCollection = collection(this.firestore, `sites/${siteId}/pages`);
    // Ensure parentPageId is empty string if not provided for easier querying
    if (!page.parentPageId) {
      page.parentPageId = '';
    }
    const docRef = await addDoc(pagesCollection, page);
    return docRef.id;
  }

  async updatePage(siteId: string, id: string, page: Partial<Page>): Promise<void> {
    const pageDoc = doc(this.firestore, `sites/${siteId}/pages`, id);
    if (page.parentPageId === null || page.parentPageId === undefined) {
       // Do not overwrite parentPageId if not provided in Partial
    } else if (page.parentPageId === '') {
       // already root
    }
    
    await updateDoc(pageDoc, page as { [x: string]: any });
  }

  async deletePage(siteId: string, id: string): Promise<void> {
    const pageDoc = doc(this.firestore, `sites/${siteId}/pages`, id);
    await deleteDoc(pageDoc);
  }
}
