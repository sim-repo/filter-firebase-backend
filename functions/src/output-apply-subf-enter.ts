import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'
import { RangePrice } from './model-range-price';
import * as m from './index';


export function getResults(data: any) {
    
    const categoryId = data.categoryId as number
    const category = m.cacheByCategory[categoryId]

    const applied = new Set()

    const arr = data.appliedSubFilters
    applyLogic.setAppliedSubFilters(arr, applied)
    const filterId = data.filterId
    const rangePrice = new RangePrice()
    userCache.parseRangePrice(data, rangePrice)


    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {}
    const countItemsBySubfilter_: {[id: number]: number} = {}

    userCache.prepareUserCacheFilter(category.filters, filters_)
    userCache.prepareUserCacheSubfilter(category.subFilters, subFilters_)


    applyLogic.applyBeforeEnter(applied, 
                                filterId, 
                                filters_, 
                                category.subFilters, 
                                subFilters_, 
                                countItemsBySubfilter_,
                                rangePrice
                                )
    const subFiltersIds = applyLogic.getEnabledSubFiltersIds(subFilters_)
    
    const json1 = JSON.stringify({"filterId" : String(filterId)})
    const json2 = converter.arrToJson(subFiltersIds)
    const json3 = converter.arrToJson(Array.from(applied))
    
    const json4 = converter.dictionaryToJson(countItemsBySubfilter_)

    return {
        filterId: json1,
        subFiltersIds: json2,
        appliedSubFiltersIds: json3,
        countItemsBySubfilter: json4
    }

}