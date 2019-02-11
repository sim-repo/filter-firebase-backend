import * as converter from './converter';
import * as applyLogic from './main-applying-logic';
import * as userCache from './user-cache'


export function getResults(filterId: number, applied: Set<number>, selected: Set<number>): [String, String, String, String, String]{


    const filters_: { [id: number]: boolean } = {}
    const subFilters_: { [id: number]: boolean } = {};
    const countItemsBySubfilter_: {[id: number]: number} = {}


    userCache.prepareUserCacheFilter(applyLogic.filters, filters_)
    userCache.prepareUserCacheSubfilter(applyLogic.subFilters, subFilters_)


    applyLogic.removeFilter(applied, selected, filterId, filters_, applyLogic.subFilters, subFilters_, countItemsBySubfilter_)
    const result1 = applyLogic.getEnabledFiltersIds(filters_)
    const json1 = converter.arrToJson(result1)
    const result2 = applyLogic.getEnabledSubFiltersIds(subFilters_)
    const json2= converter.arrToJson(result2)
    const result3 = applied
    const json3= converter.arrToJson(Array.from(result3))
    const result4 = selected
    const json4= converter.arrToJson(Array.from(result4))
    const json5 = converter.itemsBySubfilterToJson(countItemsBySubfilter_)


    return [json1, json2, json3, json4, json5]
}