import * as m from './index';

export function getResults(data: any) {

    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const json1 = category.subFiltersJSON
    const json2 = category.subfiltersByFilterJSON

    return{
        subFilters: json1,
        subfiltersByFilter: json2,
    }
}