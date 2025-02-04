import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { HomeComponent } from './pages/home/home.component';
import { AddSongComponent } from './pages/add-song/add-song.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add-song',
    component: AddSongComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'favorites',
    component: FavoriteComponent,
  },
];
