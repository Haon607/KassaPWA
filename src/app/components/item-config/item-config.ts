import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Item } from "../../models/item";
import { Memory } from "../../services/memory.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from '../dialog/dialog.service';

@Component({
    selector: 'app-item-config', imports: [ReactiveFormsModule, FormsModule], templateUrl: './item-config.html', standalone: true, styleUrl: './item-config.css'
})
export class ItemConfig {
    private items: Item[];

    constructor(
        private storage: Memory,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private dialog: DialogService,
    ) {
        this.items = this.storage.getItems();

        this.items.forEach(item => {
            if (!item.details) {
                item.details = {price: 0, name: '', color: '#808080'};
            }
        });
    }

    get item() {
        return this.items.find(item => item.index === Number(this.activatedRoute.snapshot.paramMap.get('id')))!;
    }

    set item(set: Item) {
        const idx = this.items.findIndex(item => item.index === Number(this.activatedRoute.snapshot.paramMap.get('id')));
        if (idx !== -1) {
            this.items[idx] = set;
        }
    }

    save() {
        this.items.forEach(item => {
            if (item.details && (!item.details.name || item.details.price == null)) {
                item.details = undefined;
            }
        });

        this.storage.deleteLatestSavedItems();
        this.storage.setItems(this.items);
        this.router.navigateByUrl('items');
    }

    reset() {
        this.item.details = {price: 0, name: '', color: '#808080'};
    }

    protected async confirmReset(): Promise<void> {
        if (await this.dialog.confirm('Möchtest du wirklich diese Kachel auf den Standard zurücksetzen?')) {
            this.reset();
        }
    }
}
