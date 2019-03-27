import * as m from './index';


export function getResults(data: any): [String, String, String, String, String, String] {


    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const json1 = category.filtersJSON
    const json2 = category.subFiltersJSON
    const json3 = category.subfiltersByFilterJSON
    const json4 = category.subfiltersByItemJSON
    const json5 = category.itemsBySubfilterJSON
    const json6 = category.priceByItemJSON

    return [json1, json2, json3, json4, json5, json6]
}