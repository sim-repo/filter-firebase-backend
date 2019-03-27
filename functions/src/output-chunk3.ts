import * as m from './index';


export function getResults(data: any) {

    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]


    const json1 = category.subfiltersByItemJSON
    const json2 = category.itemsBySubfilterJSON
    const json3 = category.priceByItemJSON
    
    return{
        subfiltersByItem: json1,
        itemsBySubfilter: json2,
        priceByItemId: json3
    }
}