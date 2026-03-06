import { LayoutOptions } from './layout-options.model';

export interface Page {
  id?: string;
  siteId: string;
  name: string;
  content: string;
  imageUrl?: string;
  layoutOptions?: LayoutOptions;
  parentPageId?: string;
  showOnParent: boolean;
  sortNumber: number;
  showInNavigation: boolean;
}
