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

export function mergeItems(itemsA: Item[], itemsB: Item[]): Item[] {
    const result = new Map<number, Item>();

    const addToMap = (items: Item[]) => {
        for (const item of items) {
            const existing = result.get(item.index);

            if (existing) {
                result.set(item.index, {
                    ...existing,
                    amount: (existing.amount ?? 0) + (item.amount ?? 0)
                });
            } else {
                result.set(item.index, { ...item });
            }
        }
    };

    addToMap(itemsA);
    addToMap(itemsB);

    return Array.from(result.values());
}
