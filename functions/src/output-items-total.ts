import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'
import { RangePrice } from './model-range-price';


export function getResults(applied: Set<number>, 
                           selected: Set<number>, 
                           rangePrice: RangePrice): String {
    
    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};
    userCache.prepareUserCacheFilter(applyLogic.filters, filters_)
    userCache.prepareUserCacheSubfilter(applyLogic.subFilters, subFilters_)

    const count = applyLogic.applyForTotal(applied, 
                                           selected, 
                                           applyLogic.subFilters, 
                                           rangePrice)
    
    
    const json = JSON.stringify({"total" : String(count)})
    return json
}