import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from "@angular/common";
import { Memory } from "../../services/memory.service";
import { Tab } from "../../models/tab";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

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
                //todo add current itemlist items to this tab
                this.resetAndReturn();
                break;
            case 'restoring':
                //todo load items back to itemlist, remove this tab
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

        this.router.navigateByUrl('items');
    }
}
