import { Routes } from '@angular/router';
import { ItemTable } from "./components/item-table/item-table";
import { Config } from "./components/config/config";
import { ItemConfig } from "./components/item-config/item-config";
import { Calculation } from "./components/calculation/calculation";

export const routes: Routes = [
    {path: 'items', component: ItemTable},
    {path: 'item/:id', component: ItemConfig},
    {path: 'config', component: Config},
    {path: 'calculation', component: Calculation},
];
