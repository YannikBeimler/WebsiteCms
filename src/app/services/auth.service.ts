import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, user, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, switchMap, of } from 'rxjs';
import { UserProfile, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // Observable of the raw Firebase User
  readonly authState$ = authState(this.auth);

  // BehaviorSubject holding our extended UserProfile with roles
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  readonly userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    this.authState$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await this.getUserProfile(firebaseUser.uid);
        if (profile) {
          this.userProfileSubject.next({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: profile.role || { isAdmin: false, siteGroups: [] }
          });
        } else {
           // Create a default profile if it doesn't exist
           const defaultProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: { isAdmin: false, siteGroups: [] }
          };
          await setDoc(doc(this.firestore, 'users', firebaseUser.uid), defaultProfile);
          this.userProfileSubject.next(defaultProfile);
        }
      } else {
        this.userProfileSubject.next(null);
      }
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async loginWithEmail(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async logout() {
    return signOut(this.auth);
  }

  private async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDocRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }
}
