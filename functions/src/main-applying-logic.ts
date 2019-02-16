
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';
import * as helper from './helper';
import * as m from './index';


export let filters: { [id: number]: FilterModel; } = {};
export let subFilters: { [id: number]: SubFilterModel; } = {};


export let subfiltersByFilter: {[id: number]: number[]} = {};
export let subfiltersByItem: {[id: number]: number[]} = {};
export let itemsBySubfilter: {[id: number]: number[]} = {};




export function getEnabledFiltersIds(enabledFilters_: { [id: number]: boolean; }) {
    const res: number[] = []
    
    for (const key in enabledFilters_) {
        if (enabledFilters_[key]) {
            res[key] = Number(key)
        }
     }
     return res.sort((n1,n2)=> n1 - n2)
}


export function getEnabledSubFiltersIds(enabledSubfilters_: { [id: number]: boolean; }) {
    const res: number[] = []
    for (const key in enabledSubfilters_) {
        if (enabledSubfilters_[key]) {
            res[key] = Number(key)
        }
     }
     return res.sort((n1,n2)=> n1 - n2)
}


function getItemIds(bySubFilterIds: number[]) {
    let arr: number[] = []
    for (const key in bySubFilterIds) {
        
        const id = bySubFilterIds[key]
        if (itemsBySubfilter[id] != null) {
            const tmp = itemsBySubfilter[id]
            for (const i of tmp) {
                arr.push(i)
            }
            //arr = arr.concat(tmp)
        }
    }
    const set = new Set(arr)
    return set
}


export function getItemsIntersect(applyingByFilter: {[id: number]: number[]}, exceptFilterId: number = 0) {
    let res = new Set<number>()
    let tmp = new Set<number>()

    for (const key in applyingByFilter) {
        if ((Number(key) != exceptFilterId) || (exceptFilterId == 0)) {
            
            const val = applyingByFilter[key]
            tmp = getItemIds(val)
        }
        res = (res.size == 0) ? tmp : new Set([...res].filter(x => tmp.has(x)))
    }
    return res;
}

export function groupApplying(applyingByFilter: {[id: number]: number[]}, applying: Set<number>, subFilters_: { [id: number]: SubFilterModel; }){
    for (const id of applying) {
        if (subFilters_[id] !== null) {
            const subFilterModel = subFilters_[id]
            const filterId = subFilterModel.filterId

            if (applyingByFilter[filterId] == null) {
                applyingByFilter[filterId] = []
            }
            applyingByFilter[filterId].push(id)
        }
    }
}


function getSubFilters(items: Set<number>, countItemsBySubfilter_: {[id: number]: number} = null){
    const arr: number[] = []

    for (const key of items) {
        const tmp = subfiltersByItem[key]
        for (const i of tmp) {
            arr.push(i)
        }
    }
   
    if (countItemsBySubfilter_ != null) {
        arr.forEach (id => {
            if (countItemsBySubfilter_[id] == null) {
                countItemsBySubfilter_[id] = 1
                
            } else {
                countItemsBySubfilter_[id] += 1
            }
        })
    }
    return new Set(arr);
}



function fillItemsCount(byfilterId: number, countItemsBySubfilter_: {[id: number]: number}){
    const subfilters = subfiltersByFilter[byfilterId]
    for (const subfID of subfilters) {
        const tmp = itemsBySubfilter[subfID]
        if (tmp != null) {
            countItemsBySubfilter_[subfID] = tmp.length
        }
    }
}


function enableAllFilters(enabledFilters_: { [id: number]: boolean; }, exceptFilterId: number = 0 , enable: boolean){
    for (const id in enabledFilters_) {
        enabledFilters_[id] = enable;
    }
    if (exceptFilterId != 0) {
        enabledFilters_[exceptFilterId] = true
    }
}

function enableAllSubFilters(filterId: number = 0, subFilters_: { [id: number]: SubFilterModel; }, enabledSubfilters_: { [id: number]: boolean; } , enable: boolean){
    for (const id in subFilters_ ){
        const val = subFilters_[id]
        if (val.filterId != filterId || filterId == 0) {
            enabledSubfilters_[id] = enable
        }
    }
}

function enableAllSubFilters2(filterId: number = 0, 
                              subFilters_: { [id: number]: SubFilterModel; }, 
                              enabledSubfilters_: { [id: number]: boolean; }, 
                              enable: boolean){
    for (const id in subFilters_ ){
        const val = subFilters_[id]
        if (val.filterId !== filterId || filterId === 0) {
            enabledSubfilters_[id] = enable
        }
    }
    if (filterId === 0) {
        return
    }

    for (const id in subFilters_ ){
        const val = subFilters_[id]
        if (val.filterId === filterId) {
            enabledSubfilters_[id] = !enable
        }
    }
}

function disableSubFilters(filterId: number, subFilters_: { [id: number]: SubFilterModel }, enabledSubfilters_: { [id: number]: boolean; }){
    for (const id in subFilters_ ){
        const val = subFilters_[id]
        if (val.filterId == filterId ) {
            enabledSubfilters_[id] = false
        }
    }
}

function enableFilters(filterId: number, enabledFilters_: { [id: number]: boolean; }){
    enabledFilters_[filterId] = true
}


function getApplied(appliedSubFilters_: Set<number>, subFilters_: { [id: number]: SubFilterModel }, exceptFilterId: number = 0){
    const arr: number[] = []
    if (appliedSubFilters_.size == 0) {
        return new Set<number>()
    }
    if (exceptFilterId == 0) {
        return new Set(appliedSubFilters_)
    }
    
    for (const id of appliedSubFilters_){
        if(subFilters_[Number(id)].filterId != exceptFilterId){
            arr.push(Number(id))
        }
    }
    return new Set(arr)
}


export function resetFilters(
                             appliedSubFilters_: Set<Number>, 
                             selectedSubFilters_: Set<Number>, 
                             filters_: { [id: number]: boolean }, 
                             subFilters_: { [id: number]: SubFilterModel }, 
                             enabledSubfilters_: { [id: number]: boolean }, 
                             exceptFilterId: number = 0
                             ){

    selectedSubFilters_.clear()
    appliedSubFilters_.clear()
    enableAllFilters(filters_, 0, true)
    enableAllSubFilters(exceptFilterId, subFilters_, enabledSubfilters_, true)
}



function copySet(appliedSubFilters_: Set<number>, selectedSubFilters_: Set<number>, applying:  Set<number>){
    selectedSubFilters_.clear() 
    appliedSubFilters_.clear()
    for (const element of applying) {
        selectedSubFilters_.add(element)
        appliedSubFilters_.add(element)
    }
}

function copySet2(originalSet: Set<number>,  newSet:  Set<number>){
    originalSet.clear() 
    for (const element of newSet) {
        originalSet.add(element)
    }
}



export function applyFromFilter(appliedSubFilters_: Set<number>, 
                                selectedSubFilters_: Set<number>, 
                                filters_: { [id: number]: boolean }, 
                                subFilters_: { [id: number]: SubFilterModel },
                                enabledSubfilters_: { [id: number]: boolean },
                                itemsIds: Number[]
                                ){

    const selected = selectedSubFilters_
    //let t0 = new Date().getTime()
    const applied = getApplied(appliedSubFilters_, subFilters_)
   // let t1 = new Date().getTime()                                
  //  console.log("1: " + (t1 - t0) + " milliseconds.")

    let applying = selected
     if (applied != null) {
        applying = helper.union(selected, applied)
     } 
    
    if (applying.size > 0) {
        const applyingByFilter: {[id: number]: number[]} = {}
        groupApplying(applyingByFilter, applying, subFilters_)
        const items = getItemsIntersect(applyingByFilter)
        for(const id of items) {
            itemsIds.push(id)
        }
        const rem = getSubFilters(items)
        enableAllFilters(filters_, 0,false)
        enableAllSubFilters(0, subFilters_, enabledSubfilters_, false)

        for (const id of rem) {
            if (enabledSubfilters_[id] != null) {
                const subFilter = subFilters_[id]
                enabledSubfilters_[id] = true
                enableFilters(subFilter.filterId, filters_)
            }
        }
        copySet(appliedSubFilters_, selectedSubFilters_, applying)
    }
}




export function applyFromSubFilter(filterId: number, 
                                    appliedSubFilters_: Set<number>, 
                                    selectedSubFilters_: Set<number>, 
                                    filters_: { [id: number]: boolean }, 
                                    subFilters_: { [id: number]: SubFilterModel },
                                    enabledSubfilters_: { [id: number]: boolean },
                                    countItemsBySubfilter_: {[id: number]: number }
                                    ){
    let inFilter = new Set<number>()
    if (subfiltersByFilter[filterId] != null) {
        const ids = subfiltersByFilter[filterId]
        inFilter = new Set(ids)
    }

    const selected = helper.intersect(selectedSubFilters_, inFilter)
    const applied = getApplied(appliedSubFilters_, subFilters_, filterId)
    
    let applying = selected

     if (applied != null) {
        applying = helper.union(selected, applied)
     } 

     if (applying.size == 0) {
        resetFilters(appliedSubFilters_, selectedSubFilters_, filters_, subFilters_, enabledSubfilters_)
        return
    }

    const applyingByFilter: {[id: number]: number[]} = {}
    groupApplying(applyingByFilter, applying, subFilters_)

    const items = getItemsIntersect(applyingByFilter)
    if (items.size == 0) {
        enableAllFilters(filters_, filterId, false)
        enableAllSubFilters(filterId, subFilters_, enabledSubfilters_, true)
        copySet(appliedSubFilters_, selectedSubFilters_, applying)
        return
    }

    const rem = getSubFilters(items, countItemsBySubfilter_)

    enableAllFilters(filters_, 0, false)
    enableAllSubFilters(filterId, subFilters_, enabledSubfilters_, false)

    for (const id of rem) {
        if (enabledSubfilters_[id] != null) {
            const subFilter = subFilters_[id]
            enabledSubfilters_[id] = true
            enableFilters(subFilter.filterId, filters_)
        }
    }
    // проверить нужно ли здесь копировать?
    copySet(appliedSubFilters_, selectedSubFilters_, applying)
}




function applyAfterRemove(appliedSubFilters_: Set<number>, 
                          selectedSubFilters_: Set<number>, 
                          filters_: { [id: number]: boolean }, 
                          subFilters_: { [id: number]: SubFilterModel },
                          enabledSubfilters_: { [id: number]: boolean },
                          countItemsBySubfilter_: {[id: number]: number }
                          ){

    const applying = getApplied(appliedSubFilters_, subFilters_)
    if (applying.size === 0) {
        resetFilters(appliedSubFilters_, selectedSubFilters_, filters_, subFilters_, enabledSubfilters_)
        return
    }
    const applyingByFilter: {[id: number]: number[]} = {}
    groupApplying(applyingByFilter, applying, subFilters_)
    const items = getItemsIntersect(applyingByFilter)
    if (items.size == 0) {
        resetFilters(appliedSubFilters_, selectedSubFilters_, filters_, subFilters_, enabledSubfilters_)
    }
    let filterId = 0
    if (helper.dictCount(applyingByFilter) == 1) {
        const num = helper.toNumber(helper.dictFirstKey(applyingByFilter))
        if (!Number.isNaN(num))  {
            filterId = num
        }
    }
    const rem = getSubFilters(items, countItemsBySubfilter_)
    enableAllFilters(filters_, 0,false)
    enableAllSubFilters2(filterId, subFilters_, enabledSubfilters_, false)

    for (const id of rem) {
        if (enabledSubfilters_[id] != null) {
            const subFilter = subFilters_[id]
            enabledSubfilters_[id] = true
            enableFilters(subFilter.filterId, filters_)
        }
    }
    copySet(appliedSubFilters_, selectedSubFilters_, applying)
}



export function applyBeforeEnter(appliedSubFilters_: Set<number>, 
                                 selectedSubFilters_: Set<number>, 
                                 filterId: number, 
                                 filters_: { [id: number]: boolean }, 
                                 subFilters_: { [id: number]: SubFilterModel },
                                 enabledSubfilters_: { [id: number]: boolean },
                                 countItemsBySubfilter_: {[id: number]: number }
                                 ) {

    const applied = getApplied(appliedSubFilters_, subFilters_, filterId)
    const applying = applied
    if (applying.size == 0) {
        fillItemsCount(filterId, countItemsBySubfilter_)
        enableAllSubFilters2(0, subFilters_, enabledSubfilters_, true)
        return
    }
    const applyingByFilter: {[id: number]: number[]} = {}
    groupApplying(applyingByFilter, applying, subFilters_)
    const items = getItemsIntersect(applyingByFilter)
    if (items.size == 0) {
        fillItemsCount(filterId, countItemsBySubfilter_)
        resetFilters(appliedSubFilters_, selectedSubFilters_, filters_, subFilters_, enabledSubfilters_, filterId)
        return
    }
    const rem = getSubFilters(items, countItemsBySubfilter_)
    disableSubFilters(filterId, subFilters_, enabledSubfilters_)
    for (const id of rem) {
        if (enabledSubfilters_[id] != null) {
            enabledSubfilters_[id] = true
        }
    }
}



export function removeFilter(appliedSubFilters_: Set<number>, 
                            selectedSubFilters_: Set<number>, 
                            filterId: number, 
                            filters_: { [id: number]: boolean; }, 
                            subFilters_: { [id: number]: SubFilterModel },
                            enabledSubfilters_: { [id: number]: boolean },
                            countItemsBySubfilter_: {[id: number]: number }
                            )  {

    removeApplied(appliedSubFilters_, selectedSubFilters_, filterId, subFilters_)
    applyAfterRemove(appliedSubFilters_, selectedSubFilters_, filters_, subFilters_, enabledSubfilters_, countItemsBySubfilter_)
}

function removeApplied(appliedSubFilters_: Set<number>, selectedSubFilters_: Set<number>, filterId: number = 0, subFilters_: { [id: number]: SubFilterModel; }) {
    let removing = new Set<number>()
    if (filterId == 0) {
        removing = appliedSubFilters_
    } else {
        for (const id of appliedSubFilters_) {
            if (subFilters_[id].filterId === filterId){
                removing.add(id)
            }
        }
    }

    const sub1 = helper.substract(appliedSubFilters_, removing)
    copySet2(appliedSubFilters_, sub1)
    const sub2 = helper.substract(selectedSubFilters_, removing)
    copySet2(selectedSubFilters_, sub1)
}



export function setAppliedSubFilters(arr: any, appliedSubFilters_: Set<number>){
    for (const i in arr) {
        const num = helper.toNumber(arr[i])
        if (!Number.isNaN(num))  {
            appliedSubFilters_.add(num);
        }
    }
}



export function setSelectedSubFilters(arr: any, selectedSubFilters_: Set<number>){
    for (const i in arr) {
        const num = helper.toNumber(arr[i])
        if (!Number.isNaN(num))  {
            selectedSubFilters_.add(num);
        }
    }
}