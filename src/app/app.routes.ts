import { Routes } from '@angular/router';
import { ItemTable } from "./components/item-table/item-table";
import { Config } from "./components/config/config";
import { ItemConfig } from "./components/item-config/item-config";
import { Calculation } from "./components/calculation/calculation";
import {ItemStore} from './components/item-store/item-store';

export const routes: Routes = [
    {path: '', component: ItemTable},
    {path: 'items', component: ItemTable},
    {path: 'item/:id', component: ItemConfig},
    {path: 'itemstore', component: ItemStore},
    {path: 'config', component: Config},
    {path: 'calculation', component: Calculation},
];
