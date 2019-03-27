import * as converter from './converter';
import * as m from './index';


export const prefetchLimit = 20

export function getResults(data: any) {

    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]


    const itemIds: number[] = []
 
    for (const item of category.items) {
        itemIds.push(item.id)
    }
    const json1 = converter.arrToJson(itemIds)

    const json2 = JSON.stringify({"fetchLimit" : String(prefetchLimit)})

    let json3: String = ""
    let json4: String = ""
    const rangePrice = category.rangePrice
    if (rangePrice != null) {
        json3 = JSON.stringify({"minPrice": String(rangePrice.userMinPrice)})   
        json4 = JSON.stringify({"maxPrice": String(rangePrice.userMaxPrice)})   
    }
    
    return {
        itemIds: json1,
        fetchLimit: json2,
        minPrice: json3,
        maxPrice: json4
    }
}