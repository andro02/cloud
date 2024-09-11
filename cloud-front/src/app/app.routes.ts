import { Routes } from '@angular/router';
import { FilmsComponent } from './films/films/films.component';
import { FilmCreateComponent } from './films/film-create/film-create.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FilmUpdateComponent } from './films/film-update/film-update.component';

export const routes: Routes = [
    {component: FilmsComponent, path: "" },
    {component: FilmCreateComponent, path: "films/create"},
    {component: FilmUpdateComponent, path: "films/update/:filename"},
    {component: FilmsComponent, path: "films" },
    {component: LoginComponent, path:"auth/login"},
    {component: RegisterComponent, path:"auth/register"}
];
