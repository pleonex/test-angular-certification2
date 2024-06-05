import { Routes } from '@angular/router';
import { Error404Component } from './error404.component';
import { ModelatorShellComponent } from './modelator/modelator-shell.component';

export const routes: Routes = [
  {
    path: 'modelator',
    component: ModelatorShellComponent,
    loadChildren: () => import('./modelator/modelator.routes').then(mod => mod.MODELATOR_ROUTES),
  },
  { path: '', redirectTo: 'modelator', pathMatch: 'full' },
  { path: '**', component: Error404Component },
];
