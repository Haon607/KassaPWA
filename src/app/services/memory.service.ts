import { Injectable } from '@angular/core';
import { Item } from "../models/item";
import { Configuration } from "../models/configuration";
import { CalculationItem } from "../models/calculation";
import { Calculation } from "../components/calculation/calculation";

@Injectable({
    providedIn: 'root'
})
export class Memory {
    public setItems(items: Item[]) {
        localStorage['items'] = JSON.stringify(items);
    }

    public getItems(): Item[] {
        try {
            return JSON.parse(localStorage['items']);
        } catch (e) {
            return [];
        }
    }

    public setConfig(config: Configuration) {
        localStorage['config'] = JSON.stringify(config);
    }

    public deleteConfig() {
        localStorage.removeItem('config');
    }

    public getConfig(): Configuration {
        try {
            return JSON.parse(localStorage['config']);
        } catch (e) {
            return {
                amountOfItems: 25,
                itemsPerRow: 5,
                itemsEditable: true,
            };
        }
    }

    public setCalculationItems(items: CalculationItem[]) {
        localStorage['calculationitems'] = JSON.stringify(items);
    }

    public deleteCalculationItems() {
        localStorage.removeItem('calculationitems');
    }

    public getCalculationItems(): CalculationItem[] {
        try {
            return JSON.parse(localStorage['calculationitems'])
                .map((obj: CalculationItem) => new CalculationItem(obj.name, obj.price, obj.amount));
        } catch (e) {
            return [];
        }
    }
}
