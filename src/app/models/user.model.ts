export interface UserRole {
  isAdmin: boolean;
  siteGroups: string[]; // Array of Site IDs the user has permission to edit
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: UserRole;
}
