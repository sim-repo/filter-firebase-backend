import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'
import { RangePrice } from './model-range-price';
import * as m from './index';

export function getResults(data: any) {
    
    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const rangePrice = new RangePrice()
    userCache.parseRangePrice(data, rangePrice)

    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};

    userCache.prepareUserCacheFilter(category.filters, filters_)
    userCache.prepareUserCacheSubfilter(category.subFilters, subFilters_) // ????

    applyLogic.applyByPrice(rangePrice, filters_, category.subFilters,)
    
    const result= applyLogic.getEnabledFiltersIds(filters_)
    const json = converter.arrToJson(result)
    
    return {
        filterIds: json
    }
}