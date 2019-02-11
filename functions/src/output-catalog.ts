
import * as m from './index';
import * as converter from './converter';
import { CatalogModel } from './model-catalog';
import * as applyLogic from './main-applying-logic';

export function getResults(categoryId: number, offset: number, applied: Set<number>){

    const items = m.itemsByCatalog[categoryId]
    const limit = 5
    let next:CatalogModel[] = new Array()
    if (items.length > offset) {
        const end = items.length  >  offset + limit ? items.length: offset + limit
        next = items.slice(offset, end)
    }
    const itemsById: { [id: number]: CatalogModel; } = { };

    for (const element of next) {
        itemsById[element.id] = element
    }

    if (applied.size === 0) {
        const json = converter.arrToJson2(next)
        return json
    } else {
        const applyingByFilter: {[id: number]: number[]} = {}
        applyLogic.groupApplying(applyingByFilter, applied, applyLogic.subFilters)
        const searchedItems = applyLogic.getItemsIntersect(applyingByFilter)

        const result:CatalogModel[] = new Array()

        for (const id of searchedItems){
            if (itemsById[id] != null) {
                result.push(itemsById[id] )
            }
        }
        const json = converter.arrToJson2(result)
        return json
    }
}