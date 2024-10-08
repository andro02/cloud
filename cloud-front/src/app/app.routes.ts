import { Routes } from '@angular/router';
import { FilmsComponent } from './films/films/films.component';
import { FilmCreateComponent } from './films/film-create/film-create.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FilmUpdateComponent } from './films/film-update/film-update.component';
import { FavouritesComponent } from './favourites/favourites/favourites.component';

export const routes: Routes = [
    {component: LoginComponent, path: "" },
    {component: FilmCreateComponent, path: "films/create"},
    {component: FilmUpdateComponent, path: "films/:filename/update"},
    {component: FavouritesComponent, path: "favourites/favourites"},
    {component: FilmsComponent, path: "films" },
    {component: LoginComponent, path:"auth/login"},
    {component: RegisterComponent, path:"auth/register"}
];
