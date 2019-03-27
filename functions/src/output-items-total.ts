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
    userCache.parseRangePrice(data, rangePrice)
    
    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};
    userCache.prepareUserCacheFilter(category.filters, filters_)
    userCache.prepareUserCacheSubfilter(category.subFilters, subFilters_)

    const count = applyLogic.applyForTotal(applied, 
                                           selected, 
                                           category.subFilters, 
                                           rangePrice)
    
    const json = JSON.stringify({"total" : String(count)})
    return {
        itemsTotal: json
    }
}