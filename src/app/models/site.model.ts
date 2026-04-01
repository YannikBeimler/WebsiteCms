import { LayoutOptions } from './layout-options.model';

export interface Site {
  id?: string;
  name: string;
  url: string;
  layoutOptions: LayoutOptions;
}
