import * as m from './index';
import * as converter from './converter';

export function getResults(categoryId: number): String {
    const itemIds: number[] = []
    for (const item of m.itemsByCatalog[categoryId]) {
        itemIds.push(item.id)
    }
    const json = converter.arrToJson(itemIds)
    return json
}