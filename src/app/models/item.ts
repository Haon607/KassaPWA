export interface Item {
    index: number,
    details?: Details,
    amount?: number,
}

export interface Details {
    name: string,
    price: number,
    color: string,
}
