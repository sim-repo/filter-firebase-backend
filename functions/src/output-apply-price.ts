import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'
import { RangePrice } from './model-range-price';

export function getResults(rangePrice: RangePrice): String{
    
    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};

    userCache.prepareUserCacheFilter(applyLogic.filters, filters_)
    userCache.prepareUserCacheSubfilter(applyLogic.subFilters, subFilters_) // ????

    applyLogic.applyByPrice(rangePrice, filters_, applyLogic.subFilters,)
    
    const result= applyLogic.getEnabledFiltersIds(filters_)
    const json = converter.arrToJson(result)
    return json
}