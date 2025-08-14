import { Component } from '@angular/core';
import { CalculationItem } from "../../models/calculation";
import { Memory } from "../../services/memory.service";
import { CurrencyPipe } from "@angular/common";

@Component({
    selector: 'app-calculation',
    imports: [
        CurrencyPipe
    ],
    templateUrl: './calculation.html',
    standalone: true,
    styleUrl: './calculation.css'
})
export class Calculation {
    items: CalculationItem[];

    constructor(protected storage: Memory) {
        this.items = storage.getCalculationItems();
    }

    get total() {
        try {
            return this.items.map(item => item.price * item.amount).reduce((prev, curr) => prev + curr);
        } catch (e) {
            return 0;
        }
    }

    delete() {
        this.storage.deleteCalculationItems();
        this.items = [];
    }

    getTableText(): string {
        // Column headers
        const headers = ['Name', 'Einzelpreis', 'Menge', 'Gesamtpreis'];

        // Helper to pad strings to a fixed width
        const pad = (str: string | number, width: number) => {
            return str.toString().padEnd(width, ' ');
        };

        // Build table text
        let table = '';
        table += `${pad(headers[0], 20)}${pad(headers[1], 15)}${pad(headers[2], 8)}${pad(headers[3], 15)}\n`;
        table += '-'.repeat(58) + '\n';

        for (let item of this.items) {
            table += `${pad(item.name, 20)}${pad(item.price.toFixed(2) + ' €', 15)}${pad(item.amount, 8)}${pad((item.price * item.amount).toFixed(2) + ' €', 15)}\n`;
        }

        table += '-'.repeat(58) + '\n';
        table += `${pad('Summe:', 43)}${pad(this.total.toFixed(2) + ' €', 15)}\n`;

        return table;
    }

    sendPerMail() {
        const body = encodeURIComponent(this.getTableText());
        window.location.href = `mailto:?body=${body}`;
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.getTableText());
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    getTableCSV(): string {
        // No headers as requested
        return this.items
            .map(item => `${item.name},${item.price.toFixed(2)},${item.amount},${(item.price * item.amount).toFixed(2)}`)
            .join('\n');
    }

    downloadCSV() {
        const csvContent = this.getTableCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Format date as YYYY-MM-DD
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // e.g., "2025-08-14"

        const link = document.createElement('a');
        link.href = url;
        link.download = `${dateStr}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }

    protected readonly confirm = confirm;
}
