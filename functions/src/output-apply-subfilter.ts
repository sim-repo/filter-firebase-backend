import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'
import { RangePrice } from './model-range-price';

export function getResults(filterId: number, 
                            applied: Set<number>, 
                            selected: Set<number>, 
                            rangePrice: RangePrice): [String, String, String, String, String, String, String]{
    
    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};
    
    userCache.prepareUserCacheFilter(applyLogic.filters, filters_)
    userCache.prepareUserCacheSubfilter(applyLogic.subFilters, subFilters_)                     

    applyLogic.applyFromSubFilter(filterId, 
                                    applied, 
                                    selected, 
                                    filters_, 
                                    applyLogic.subFilters, 
                                    subFilters_, 
                                    rangePrice
                                    )

    const result1 = applyLogic.getEnabledFiltersIds(filters_)
    const json1 = converter.arrToJson(result1)
    const result2 = applyLogic.getEnabledSubFiltersIds(subFilters_)
    const json2= converter.arrToJson(result2)
    const result3 = applied
    const json3= converter.arrToJson(Array.from(result3))
    const result4 = selected
    const json4= converter.arrToJson(Array.from(result4))
    const json5 = JSON.stringify({"tipMinPrice" : String(rangePrice.tipMinPrice)})    
    const json6 = JSON.stringify({"tipMaxPrice" : String(rangePrice.tipMaxPrice)})      
    const json7 = JSON.stringify({"total" : String(rangePrice.itemsTotal)})

    return [json1, json2, json3, json4, json5, json6, json7]
}