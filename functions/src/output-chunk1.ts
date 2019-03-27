import * as m from './index';

export function getResults(data: any) {

    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const json = category.filtersJSON
    return{
        filters: json
    }
}