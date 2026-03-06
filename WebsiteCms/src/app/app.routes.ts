import { Routes } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';
import { LoginComponent } from './components/login/login.component';
import { PageRouteComponent } from './components/page-route/page-route.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'page/:id', component: PageRouteComponent },
      // By default, do not redirect to a hardcoded 'page/home' if we don't know it exists
      // We can let the user pick a page from navigation, or we could redirect to the first nav page
      // But keeping it empty here allows Shell to decide what to show (like "Select a page")
    ]
  }
];
