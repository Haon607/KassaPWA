import { Item } from "./item";

export class CalculationItem {
    name: string;
    price: number;
    amount: number;

    constructor(name: string, price: number, amount: number);
    constructor(item: Item);
    constructor(
        nameOrItem: string | number | Item,
        price?: number,
        amount?: number
    ) {
        if (typeof nameOrItem === "string" || typeof nameOrItem === "number") {
            this.name = nameOrItem + '';
            this.price = price!;
            this.amount = amount!;
        } else {
            if (nameOrItem.details) {
                this.name = nameOrItem.details.name;
                this.price = nameOrItem.details.price;
                this.amount = nameOrItem.amount ?? 0;
            } else {
                throw Error(`Details are undefined`);
            }
        }
    }

    get uniqueString(): string {
        return String(this.name) + "-" + this.price;
    }

    addThisToThatArray(array: CalculationItem[]) {
        const match = array.find(item => item.uniqueString === this.uniqueString);
        if (match) {
            match.amount += this.amount;
            return array;
        }
        array.push(this);
        return array;
    }
}

