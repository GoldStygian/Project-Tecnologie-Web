import { Routes } from '@angular/router';
import { CatsPage } from './cats-page/cats-page';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "cats",
        pathMatch: "full"
    },
    {
        path: "cats",
        component: CatsPage
    }
];
