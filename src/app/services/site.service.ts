import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from '@angular/fire/firestore';
import { Site } from '../models/site.model';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private firestore: Firestore = inject(Firestore);

  async getSites(): Promise<Site[]> {
    const sitesCollection = collection(this.firestore, 'sites');
    const sitesSnapshot = await getDocs(sitesCollection);
    return sitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site));
  }

  async getSiteById(id: string): Promise<Site | null> {
    const siteDoc = doc(this.firestore, 'sites', id);
    const docSnap = await getDoc(siteDoc);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Site : null;
  }

  async getSiteByUrl(url: string): Promise<Site | null> {
    const sitesCollection = collection(this.firestore, 'sites');
    const q = query(sitesCollection, where('url', '==', url));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Site;
    }
    return null;
  }

  async createSite(site: Site): Promise<string> {
    const sitesCollection = collection(this.firestore, 'sites');
    const docRef = await addDoc(sitesCollection, site);
    return docRef.id;
  }

  async updateSite(id: string, site: Partial<Site>): Promise<void> {
    const siteDoc = doc(this.firestore, 'sites', id);
    await updateDoc(siteDoc, site);
  }

  async deleteSite(id: string): Promise<void> {
    // 1. Fetch all pages in subcollection
    const pagesCollection = collection(this.firestore, `sites/${id}/pages`);
    const pagesSnapshot = await getDocs(pagesCollection);

    // 2. Use batch to delete all pages and the site
    const batch = writeBatch(this.firestore);

    pagesSnapshot.docs.forEach(pageDoc => {
      batch.delete(pageDoc.ref);
    });

    // 3. Delete the site document itself
    const siteDoc = doc(this.firestore, 'sites', id);
    batch.delete(siteDoc);

    await batch.commit();
  }
}
