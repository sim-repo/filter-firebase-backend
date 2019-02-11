import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'


export function getResults(filterId: number, applied: Set<number>, selected: Set<number>): [String, String, String, String]{
    
    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {}
    const countItemsBySubfilter_: {[id: number]: number} = {}

    userCache.prepareUserCacheFilter(applyLogic.filters, filters_)
    userCache.prepareUserCacheSubfilter(applyLogic.subFilters, subFilters_)

    applyLogic.applyBeforeEnter(applied, selected, filterId, filters_, applyLogic.subFilters, subFilters_, countItemsBySubfilter_)
    const subFiltersIds = applyLogic.getEnabledSubFiltersIds(subFilters_)
    
    const json1 = JSON.stringify({"filterId" : String(filterId)})
    const json2 = converter.arrToJson(subFiltersIds)
    const json3 = converter.arrToJson(Array.from(applied))
    
    const json4 = converter.itemsBySubfilterToJson(countItemsBySubfilter_)
    console.log(json4)
    return [json1, json2, json3, json4]
}