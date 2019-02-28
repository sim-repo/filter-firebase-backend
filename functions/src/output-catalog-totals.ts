import * as m from './index';
import * as converter from './converter';
import * as applyLogic from './main-applying-logic';


export function getResults(categoryId: number): [String, String, String] {
    const itemIds: number[] = []
 
    for (const item of m.itemsByCatalog[categoryId]) {
        itemIds.push(item.id)
    }
    const json1 = converter.arrToJson(itemIds)

    let json2: String = ""
    let json3: String = ""
    const rangePrice = applyLogic.rangePriceByCategory[categoryId]
    if (rangePrice != null) {
        json2 = JSON.stringify({"minPrice": String(rangePrice.userMinPrice)})   
        json3 = JSON.stringify({"maxPrice": String(rangePrice.userMaxPrice)})   
    }
    return [json1, json2, json3]
}