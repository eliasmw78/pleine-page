import { Routes } from '@angular/router';
import { Catalogue } from './catalogue/catalogue';
import { Fiche } from './fiche/fiche';

export const routes: Routes = [
  { path: '', component: Catalogue },
  { path: 'livre/:id', component: Fiche }
];
