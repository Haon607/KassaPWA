import { Injectable } from '@angular/core';
import { Item } from "../models/item";

@Injectable({
    providedIn: 'root'
})
export class Memory {
    public setItems(items: Item[]) {
        localStorage['items'] = JSON.stringify(items);
    }

    public getItems(): Item[] {
        return JSON.parse(localStorage['items']) ?? [];
    }
}
