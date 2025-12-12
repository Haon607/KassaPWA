import { Item } from "./item";

export class Tab {
    name: string;
    items: Item[];
    openedTime: number;

    constructor(name: string, items: Item[], openedTime: number) {
        this.name = name;
        this.items = items;
        this.openedTime = openedTime;
    }
}
