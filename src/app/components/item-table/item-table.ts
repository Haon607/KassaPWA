import { Component } from '@angular/core';
import { Memory } from "../../services/memory.service";
import { Item } from "../../models/item";
import { ItemBox } from "../item-box/item-box";

@Component({
    selector: 'app-item-table',
    imports: [
        ItemBox
    ],
    templateUrl: './item-table.html',
    standalone: true,
    styleUrl: './item-table.css'
})
export class ItemTable {
    items: Item[];

    constructor(protected storage: Memory) {
        this.items = storage.getItems();
    }

    get itemRows(): Item[][] {
        const rowSize = 5;
        const rows: Item[][] = []
        for (let i = 0; i < this.items.length; i += rowSize) {
            rows.push(this.items.slice(i, i + rowSize));
        }
        return rows;
    }
}
