import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'
import { RangePrice } from './model-range-price';
import * as m from './index';


export function getResults(data: any){
    
    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const applied = new Set()
    const selected = new Set()
    userCache.parseDataApplying(data, applied, selected)
    const rangePrice = new RangePrice()
    userCache.parseRangePriceWhenMaybeReset(data, rangePrice)
    const filterId = data.filterId

    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};
    
    userCache.prepareUserCacheFilter(category.filters, filters_)
    userCache.prepareUserCacheSubfilter(category.subFilters, subFilters_)                     

    applyLogic.applyFromSubFilter(filterId, 
                                    applied, 
                                    selected, 
                                    filters_, 
                                    category.subFilters, 
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

    return {
        filtersIds: json1,
        subFiltersIds: json2,
        appliedSubFiltersIds: json3,
        selectedSubFiltersIds: json4,
        tipMinPrice: json5,
        tipMaxPrice: json6,
        itemsTotal: json7
    }
}