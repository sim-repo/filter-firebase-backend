import * as m from './index';

export function getResults(data: any) {

    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const json1 = category.filtersJSON
    const json2 = category.subFiltersJSON


    return{
        filters: json1,
        subFilters: json2 
    }
}