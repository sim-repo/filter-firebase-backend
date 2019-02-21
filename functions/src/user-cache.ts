
import * as helper from './helper'
import * as applyLogic from './main-applying-logic'
import * as mf from './model-filter';
import * as sf from './model-subfilter';

export function parseDataApplying(data: any, appliedSubFilters_: Set<number>, selectedSubFilters_: Set<number>){
    const applied = data.appliedSubFilters as String
    const selected = data.selectedSubFilters as String
    
    if (helper.stringIsNullOrEmpty(applied) === false) {
        const str = applied.toString()
        const arr = str.split(",");
        applyLogic.setAppliedSubFilters(arr, appliedSubFilters_)
    }
    
    if (helper.stringIsNullOrEmpty(selected) === false) {
        const str = selected.toString()
        const arr = str.split(",");
        applyLogic.setSelectedSubFilters(arr, selectedSubFilters_)
    }
}

export function parseMinPrice(data: any): number{
    const sPriceFrom = data.minPrice as String
    if (helper.stringIsNullOrEmpty(sPriceFrom) === false) {
        return helper.toNumber(sPriceFrom)
    }
    return 0
}

export function parseMaxPrice(data: any): number{
    const sPriceTo = data.maxPrice as String
    if (helper.stringIsNullOrEmpty(sPriceTo) === false) {
        return helper.toNumber(sPriceTo)
    }
    return 0
}


export function useGlobalCache(data: any): Boolean{
    const useCache = data.useCache as Boolean
    if (useCache != null){
        return useCache
    }
    return false
}


export function prepareUserCacheFilter(from: { [id: number]: mf.FilterModel; }, to: { [id: number]: boolean; }) {
    for(const key in from) {
        to[key] = true
    }
}

export function prepareUserCacheSubfilter(from: { [id: number]: sf.SubFilterModel; }, to: { [id: number]: boolean; }) {
    for(const key in from) {
        to[key] = true
    }
}