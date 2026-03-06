import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private firestore: Firestore = inject(Firestore);

  async getPagesForSite(siteId: string): Promise<Page[]> {
    const pagesCollection = collection(this.firestore, 'pages');
    const q = query(pagesCollection, where('siteId', '==', siteId), orderBy('sortNumber'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  }

  async getRootPagesForSite(siteId: string): Promise<Page[]> {
      const pagesCollection = collection(this.firestore, 'pages');
      // Firestore doesn't allow 'where parentPageId == null' directly if the field doesn't exist,
      // but if we store null or empty string, we can query it. We'll use an empty string for "root".
      const q = query(pagesCollection, where('siteId', '==', siteId), where('parentPageId', '==', ''), orderBy('sortNumber'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  }

  async getPageById(id: string): Promise<Page | null> {
    const pageDoc = doc(this.firestore, 'pages', id);
    const docSnap = await getDoc(pageDoc);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Page : null;
  }

  async getChildPages(parentId: string): Promise<Page[]> {
    const pagesCollection = collection(this.firestore, 'pages');
    const q = query(pagesCollection, where('parentPageId', '==', parentId), orderBy('sortNumber'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  }

  async createPage(page: Page): Promise<string> {
    const pagesCollection = collection(this.firestore, 'pages');
    // Ensure parentPageId is empty string if not provided for easier querying
    if (!page.parentPageId) {
      page.parentPageId = '';
    }
    const docRef = await addDoc(pagesCollection, page);
    return docRef.id;
  }

  async updatePage(id: string, page: Partial<Page>): Promise<void> {
    const pageDoc = doc(this.firestore, 'pages', id);
    if (page.parentPageId === null || page.parentPageId === undefined) {
       page.parentPageId = '';
    }
    await updateDoc(pageDoc, page);
  }

  async deletePage(id: string): Promise<void> {
    const pageDoc = doc(this.firestore, 'pages', id);
    // Note: Deleting a page should probably also handle deleting/reparenting children.
    // We'll keep it simple for now and just delete the target page.
    await deleteDoc(pageDoc);
  }
}
