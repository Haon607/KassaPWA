import {Component} from '@angular/core';
import {Memory} from "../../services/memory.service";
import {Item} from "../../models/item";
import {ItemBox} from "../item-box/item-box";
import {Configuration} from "../../models/configuration";
import {CurrencyPipe, NgStyle} from "@angular/common";
import {Router} from "@angular/router";
import {CalculationItem} from "../../models/calculation";
import {DialogService, DialogTable} from "../dialog/dialog.service";

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
    private static readonly WHOLE_EURO_OFFSETS = [0, 1, 2, 3, 4];
    private static readonly TOTAL_ROUNDING_STEPS_IN_EUROS = [5, 10];
    private static readonly PROVIDED_ROUNDING_STEPS_IN_CENTS = [10, 20, 50];
    private static readonly PROVIDED_ROUNDING_STEPS_IN_EUROS = [5, 10, 20, 50, 100];

    items: Item[];
    config: Configuration;

    private readonly euroFormatter = new Intl.NumberFormat('de-AT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    });

    constructor(protected storage: Memory, private router: Router, private dialog: DialogService) {
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

    get price() {
        return this.items.map(item => (item.details?.price ?? 0) * (item.amount ?? 0)).reduce((prev, curr) => prev + curr);
    }

    holdItem(item: Item) {
        if (item.details && item.amount && item.amount > 0) {
            item.amount--;
        } else if (this.config.itemsEditable) {
            this.router.navigateByUrl('item/' + item.index)
        }
        this.storage.setItems(this.items);
    }

    clickItem(item: Item) {
        if (item.details) {
            if (!item.amount) item.amount = 0;
            item.amount++;
        }
        this.storage.setItems(this.items);
    }

    submit() {
        let calculationItems = this.storage.getCalculationItems();

        const submittedItems: Item[] = [];

        this.items
            .filter(item => item.amount && item.amount > 0)
            .forEach(item => {
                submittedItems.push({...item});
                calculationItems = new CalculationItem(item).addThisToThatArray(calculationItems);
                item.amount = undefined;
            });

        this.storage.setLatestSavedItems(submittedItems);
        this.storage.setCalculationItems(calculationItems);
        this.storage.setItems(this.items);
    }

    revertSubmit() {
        const lastSubmitted = this.storage.getLatestSavedItems();
        if (!lastSubmitted || lastSubmitted.length === 0) return;

        const calculationItems = this.storage.getCalculationItems();

        lastSubmitted.forEach(sub => {
            // Restore item amount
            const item = this.items.find(i => i.index === sub.index);
            if (item && sub.amount) {
                if (!item.amount) item.amount = 0;
                item.amount += sub.amount;
            }

            // Subtract from calculation list
            const match = calculationItems.find(
                ci => ci.name === sub.details!.name && ci.price === sub.details!.price
            );

            if (match) {
                match.amount -= sub.amount ?? 0;

                // Remove if empty
                if (match.amount <= 0) {
                    const index = calculationItems.indexOf(match);
                    calculationItems.splice(index, 1);
                }
            }
        });

        this.storage.deleteLatestSavedItems();
        this.storage.setCalculationItems(calculationItems);
        this.storage.setItems(this.items);
    }

    reset() {
        this.items = this.items.map(item => {
            if (item.details) {
                item.amount = 0;
                return item;
            } else return item;
        })
        this.storage.setItems(this.items);
    }

    protected async confirmReset(): Promise<void> {
        if (await this.dialog.confirm('Möchtest du wirklich die aktuellen Mengen löschen?')) {
            this.reset();
        }
    }

    protected async confirmRevertSubmit(): Promise<void> {
        if (await this.dialog.confirm('Letzte Eingabe zurückholen?')) {
            this.revertSubmit();
        }
    }

    get areItemsSelected(): boolean {
        return this.items.filter(item => (item.amount ?? 0) > 0).length > 0;
    }

    protected openStorage() {
        this.router.navigateByUrl('itemstore');
    }

    protected async showChangeTable(price: number): Promise<void> {
        if (price === 0) return;
        const priceInCents = Math.max(0, Math.round(price * 100));
        const roundedPriceInCents = this.roundUpToMultiple(priceInCents, 100);
        const totalAmounts = this.uniqueSortedAmounts([
            priceInCents,
            ...ItemTable.WHOLE_EURO_OFFSETS.map(offset => roundedPriceInCents + offset * 100),
            ...ItemTable.TOTAL_ROUNDING_STEPS_IN_EUROS.map(increment =>
                this.roundUpToMultiple(priceInCents, increment * 100)
            ),
        ]);
        const providedAmounts = this.uniqueSortedAmounts([
            ...ItemTable.PROVIDED_ROUNDING_STEPS_IN_CENTS.map(increment =>
                this.roundUpToMultiple(priceInCents, increment)
            ),
            ...ItemTable.WHOLE_EURO_OFFSETS.map(offset => roundedPriceInCents + offset * 100),
            ...ItemTable.PROVIDED_ROUNDING_STEPS_IN_EUROS.map(increment =>
                this.roundUpToMultiple(priceInCents, increment * 100)
            ),
        ]);
        const table: DialogTable = {
            ariaLabel: 'Wechselgeld nach Gesamtbetrag und gegebenem Betrag',
            rowLabel: 'Gesamt',
            columnLabel: 'Gegeben',
            columns: providedAmounts.map(amount => this.formatCents(amount)),
            rows: totalAmounts.map(total => ({
                label: this.formatCents(total),
                cells: providedAmounts.map(provided =>
                    provided >= total ? this.formatCents(provided - total) : '–'
                ),
            })),
        };

        await this.dialog.open({
            dismissible: true,
            level: 'info',
            title: `Wechselgeld für ${this.formatEuro(price)}`,
            message: 'Zeilen: Gesamt | Spalten: gegebener Betrag',
            table,
        });
    }

    private roundUpToMultiple(amount: number, increment: number): number {
        return Math.ceil(amount / increment) * increment;
    }

    private uniqueSortedAmounts(amounts: number[]): number[] {
        return [...new Set(amounts)].sort((first, second) => first - second);
    }

    private formatCents(amountInCents: number): string {
        return this.formatEuro(amountInCents / 100);
    }

    private formatEuro(amount: number): string {
        return this.euroFormatter.format(amount);
    }
}
