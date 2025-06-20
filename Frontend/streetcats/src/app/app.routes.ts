import { Routes } from '@angular/router';
import { CatsPage } from './cats-page/cats-page';
import { authGuard } from './_guards/auth/auth.guard';
import { Login } from './login/login';
import { AddCat } from './add-cat/add-cat';
import { CatDetailPage } from './cat-detail-page/cat-detail-page';
import { Signup } from './signup/signup';
import { Whoiam } from './whoiam/whoiam';

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
        path: "cats/:id",
        component: CatDetailPage,
        title: "Cat | Street Cats",
    },
    {
        path: "add-cat",
        component: AddCat,
        title: "Upload Cat | Street Cats",
        canActivate: [authGuard]
    },
    {
        path: "login",
        component: Login,
        title: "Login | Street Cats",
    },
    {
        path: "signup",
        component: Signup,
        title: "Signup | Street Cats",
    },
    {
        path: "about",
        component: Whoiam,
        title: "Who I Am | Street Cats"
    }
];
