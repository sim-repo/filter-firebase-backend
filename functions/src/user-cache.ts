
import * as helper from './helper'
import * as applyLogic from './main-applying-logic'
import * as mf from './model-filter';
import * as sf from './model-subfilter';
import { RangePrice } from './model-range-price';


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


export function parseRangePrice(data: any, rangePrice: RangePrice){
    const sUserMinPrice = data.userMinPrice as String
    let userMinPrice = 0
    if (helper.stringIsNullOrEmpty(sUserMinPrice) === false) {
        userMinPrice = helper.toNumber(sUserMinPrice)
    }

    const sUserMaxPrice = data.userMaxPrice as String
    let userMaxPrice = 0
    if (helper.stringIsNullOrEmpty(sUserMaxPrice) === false) {
        userMaxPrice = helper.toNumber(sUserMaxPrice)
    }

    const sTipMinPrice = data.tipMinPrice as String
    let tipMinPrice = 0
    if (helper.stringIsNullOrEmpty(sTipMinPrice) === false) {
        tipMinPrice = helper.toNumber(sTipMinPrice)
    }

    const sTipMaxPrice = data.tipMaxPrice as String
    let tipMaxPrice = 0
    if (helper.stringIsNullOrEmpty(sTipMaxPrice) === false) {
        tipMaxPrice = helper.toNumber(sTipMaxPrice)
    }


    rangePrice.userMinPrice = userMinPrice
    rangePrice.userMaxPrice = userMaxPrice
    rangePrice.tipMinPrice = 50000000
    rangePrice.tipMaxPrice = -1
    rangePrice.categoryId =  data.categoryId
}


export function parseRangePriceWhenMaybeReset(data: any, rangePrice: RangePrice){
    parseRangePrice(data, rangePrice)
    const sInitialMinPrice = data.initialMinPrice as String
    let initialMinPrice = 0
    if (helper.stringIsNullOrEmpty(sInitialMinPrice) === false) {
        initialMinPrice = helper.toNumber(sInitialMinPrice)
    }

    const sInitialMaxPrice = data.initialMaxPrice as String
    let initialMaxPrice = 0
    if (helper.stringIsNullOrEmpty(sInitialMaxPrice) === false) {
        initialMaxPrice = helper.toNumber(sInitialMaxPrice)
    }

    rangePrice.initialMinPrice = initialMinPrice
    rangePrice.initialMaxPrice = initialMaxPrice
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