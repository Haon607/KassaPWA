import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from "@angular/common";
import { Memory } from "../../services/memory.service";
import { Tab } from "../../models/tab";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { mergeItems } from "../../models/item";
import { Configuration } from "../../models/configuration";

@Component({
    selector: 'app-item-store',
    imports: [
        CurrencyPipe,
        FormsModule,
        DatePipe
    ],
    templateUrl: './item-store.html',
    standalone: true,
    styleUrl: './item-store.css'
})
export class ItemStore {
    tabs: Tab[];
    newTabName: string;

    constructor(protected storage: Memory, protected router: Router) {
        this.tabs = storage.getTabs();
        this.newTabName = (this.tabs.length + 1).toString();
    }

    getAction(): 'storing' | 'restoring' {
        if (this.storage.getItems().filter(item => (item.amount ?? 0) > 0).length > 0)
            return 'storing'
        else
            return 'restoring';
    }

    getItemAmount(tab: Tab) {
        return tab.items.map(item => item.amount ?? 0).reduce((a, b) => a + b, 0);
    }

    getTabTotal(tab: Tab) {
        return tab.items.map(item => (item.amount ?? 0) * (item.details?.price ?? 0)).reduce((a, b) => a + b, 0);
    }

    actionThisTab(tab: Tab) {
        switch (this.getAction()) {
            case 'storing':
                tab.items = mergeItems(tab.items, this.storage.getItems().filter(item => (item.amount ?? 0) > 0));
                this.resetAndReturn();
                break;
            case 'restoring':
                this.storage.setItems(mergeItems(this.storage.getItems(), tab.items));
                this.tabs = this.tabs.filter(aTab => aTab.openedTime !== tab.openedTime);
                this.tabs = this.tabs.filter(aTab => aTab.openedTime !== tab.openedTime);
                this.storage.setTabs(this.tabs);
                this.router.navigateByUrl('items');
                break;
        }
    }

    openNewTab() {
        this.tabs.push(new Tab(
            this.newTabName,
            this.storage.getItems().filter(item => (item.amount ?? 0) > 0),
            Date.now()
        ))
        this.storage.setTabs(this.tabs);
        this.resetAndReturn();
    }

    private resetAndReturn() {
        this.storage.setItems(this.storage.getItems().map(item => {
            if (item.details) {
                item.amount = 0;
                return item;
            } else return item;
        }));
        let con = this.storage.getConfig();
        con.itemsEditable = false;
        this.storage.setConfig(con);

        this.storage.setTabs(this.tabs);
        this.router.navigateByUrl('items');
    }
}
