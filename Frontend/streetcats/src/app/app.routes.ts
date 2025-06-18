import { Routes } from '@angular/router';
import { CatsPage } from './cats-page/cats-page';
import { authGuard } from './_guards/auth/auth.guard';
import { Login } from './login/login';
import { AddCat } from './add-cat/add-cat';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "cats",
        pathMatch: "full"
    },
    {
        path: "cats",
        component: CatsPage,
        title: "Street Cats",
    },
    {
        path: "login",
        component: Login,
        title: "Login | Street Cats",
    },
    {
        path: "add-cat",
        component: AddCat,
        canActivate: [authGuard]
    }
];
