import {Routes} from '@angular/router';
import {AccountRoute, AuthorizationRoute, isAuthenticated} from "ngx-fusio-sdk";
import {AccountComponent} from "./account/account.component";
import {List} from "./form/list/list";
import {Detail} from "./form/detail/detail";

export const routes: Routes = [
  {path: '', component: List, canActivate: [isAuthenticated]},
  {path: 'form', component: List, canActivate: [isAuthenticated]},
  {path: 'form/:id', component: Detail, canActivate: [isAuthenticated]},
  {path: 'account', component: AccountComponent, canActivate: [isAuthenticated], children: AccountRoute.getAll()},
  ...AuthorizationRoute.getAll(),
];
