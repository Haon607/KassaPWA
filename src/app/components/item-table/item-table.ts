import { Component } from '@angular/core';
import { Memory } from "../../services/memory.service";
import { Item } from "../../models/item";
import { ItemBox } from "../item-box/item-box";
import { Configuration } from "../../models/configuration";
import { CurrencyPipe, NgStyle } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: 'app-item-table',
    imports: [
        ItemBox,
        CurrencyPipe,
        NgStyle
    ],
    templateUrl: './item-table.html',
    standalone: true,
    styleUrl: './item-table.css'
})
export class ItemTable {
    items: Item[];
    text: string = '';
    config: Configuration;

    constructor(protected storage: Memory, private router: Router) {
        this.items = storage.getItems();
        this.config = storage.getConfig();
        if (this.items.length > this.config.amountOfItems)
            this.items = this.items.slice(0, this.config.amountOfItems)
        else
            for (let i = this.items.length; i < this.config.amountOfItems; i++)
                this.items.push({index: i});
        storage.setItems(this.items);
    }

    get itemRows(): Item[][] {
        const rowSize = this.config.itemsPerRow;
        const rows: Item[][] = []
        for (let i = 0; i < this.items.length; i += rowSize) {
            rows.push(this.items.slice(i, i + rowSize));
        }
        return rows;
    }

    holdItem(item: Item) {
        if (item.details && item.amount && item.amount > 0) {
            item.amount--;
        } else if (this.config.itemsEditable) {
            this.router.navigateByUrl('item/' + item.index)
        }
    }

    clickItem(item: Item) {
        if (item.details) {
            if (!item.amount) item.amount = 0;
            item.amount++;
        }
    }

    submit() {

    }

    reset() {
        this.items = this.items.map(item => {
            if (item.details) {
                item.amount = 0;
                return item;
            } else return item;
        })
    }

    get price() {
        return this.items.map(item => (item.details?.price ?? 0) * (item.amount ?? 0)).reduce((prev, curr) => prev + curr);
    }
}
