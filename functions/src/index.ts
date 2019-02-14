import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as applyLogic from './main-applying-logic';
import { CatalogModel } from './model-catalog';
import * as loadFirebase from './loading-firebase';
import * as loadSequence from './loading-sequence';
import * as outCatalog from './output-catalog';
import * as outCatalogTotal from './output-catalog-count';
import * as outEnterSubfilter from './output-apply-subf-enter';
import * as outRemoveFilter from './output-remove-filter';
import * as outApplyFilter from './output-apply-filter';
import * as outApplySubfilter from './output-apply-subfilter';
import * as helper from './helper';
import * as userCache from './user-cache';

admin.initializeApp();

export let itemsByCatalog: { [id: number]: CatalogModel[]; } = { };
export let itemsById: { [id: number]: CatalogModel } = { };

// ********* prepared json: ***********
export let filtersJson: String
export let subFiltersJson: String
let subfiltersByFilterJson: String
let subfiltersByItemJson: String
let itemsBySubfilterJson: String

// ********* cache controls: ***********
export let useCacheFilters = true
export let useCacheSubFilters = true
export let useCacheSubfiltersByFilter = true
export let useCacheSubfiltersByItem = true
export let useCacheItemsBySubfilter = true

export const prefetchLimit = 20


export function setFiltersJson(jsonStr: String){
    filtersJson = jsonStr
}

export function setSubfiltersJson(jsonStr: String){
    subFiltersJson = jsonStr
}

export function setCache_Filters(val: boolean) {
    useCacheFilters = val
}

export function setCache_Subfilters(val: boolean) {
    useCacheSubFilters = val
}

export function setCache_ItemsBySubfilter(val: boolean) {
    useCacheItemsBySubfilter = val
}

export function setCache_SubfiltersByFilter(val: boolean) {
    useCacheSubfiltersByFilter = val
}

export function setCache_SubfiltersByItem(val: boolean) {
    useCacheSubfiltersByItem = val
}



function parseRequest(req: functions.Request, appliedSubFilters_: Set<number>, selectedSubFilters_: Set<number>){
    const tmp1 = req.body.appliedSubFilters 
    const tmp2 = req.body.selectedSubFilters 
    const arr = tmp1.split(",");
    applyLogic.setAppliedSubFilters(arr, appliedSubFilters_)
    const arr2 = tmp2.split(",");
    applyLogic.setSelectedSubFilters(arr2, selectedSubFilters_)
}




export const apiRemoveFilter  = functions.https.onCall((data, context) => {   
    const tmpAppliedSubFilters = new Set()
    const tmpSelectedSubFilters = new Set()
    userCache.parseDataApplying(data, tmpAppliedSubFilters, tmpSelectedSubFilters)
    const filterId = data.filterId

    // force read from db
    if (helper.dictCount(applyLogic.filters) === 0 ||
    helper.dictCount(applyLogic.subFilters) === 0 || 
    helper.dictCount(applyLogic.subfiltersByFilter) === 0||
    helper.dictCount(applyLogic.subfiltersByItem) === 0 ||
    helper.dictCount(applyLogic.itemsBySubfilter) === 0) {
       // console.log("force: read from db()")
        return new Promise((res3, reject) => {
            loadSequence.loadFilterIds()
            .then(function() {
                const results = outRemoveFilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filtersIds: results[0],
                    subFiltersIds: results[1],
                    appliedSubFiltersIds: results[2],
                    selectedSubFiltersIds: results[3],
                    countItemsBySubfilter: results[4]
                })
            }).catch(function (error) {console.log('mistake!', error)})
        })    
   }


   // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
        const results = outRemoveFilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
        return {
            filtersIds: results[0],
            subFiltersIds: results[1],
            appliedSubFiltersIds: results[2],
            selectedSubFiltersIds: results[3],
            countItemsBySubfilter: results[4]
        }
    }


    // useCacheFilters ? cache : db()
    return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
            // console.log("cache-false: read from db()")
                loadSequence.loadFilterIds()
                .then(function() {
                    const results = outRemoveFilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                    res3( {
                        filtersIds: results[0],
                        subFiltersIds: results[1],
                        appliedSubFiltersIds: results[2],
                        selectedSubFiltersIds: results[3],
                        countItemsBySubfilter: results[4]
                    })
                }).catch(function (error) {console.log('mistake!', error)})
            } else {
                const results = outRemoveFilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filtersIds: results[0],
                    subFiltersIds: results[1],
                    appliedSubFiltersIds: results[2],
                    selectedSubFiltersIds: results[3],
                    countItemsBySubfilter: results[4]
                })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
})




export const applyFromFilterNow  = functions.https.onCall((data, context) => {   
   // console.log('useCacheFilters', useCacheFilters);
    const tmpAppliedSubFilters = new Set()
    const tmpSelectedSubFilters = new Set()
    userCache.parseDataApplying(data, tmpAppliedSubFilters, tmpSelectedSubFilters)

    // force read from db
    if (helper.dictCount(applyLogic.filters) === 0 ||
        helper.dictCount(applyLogic.subFilters) === 0 || 
        helper.dictCount(applyLogic.subfiltersByFilter) === 0||
        helper.dictCount(applyLogic.subfiltersByItem) === 0 ||
        helper.dictCount(applyLogic.itemsBySubfilter) === 0) {
        //console.log("force: read from db()")
        return new Promise((res3, reject) => {
            loadSequence.loadFilterIds()
            .then(function() {
                const results = outApplyFilter.getResults(tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filtersIds: results[0],
                    subFiltersIds: results[1],
                    appliedSubFiltersIds: results[2],
                    selectedSubFiltersIds: results[3],
                    itemIds: results[4]
                })
            }).catch(function (error) {console.log('mistake!', error)})
        })    
   }


    // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
    //  console.log("read from cache by mobile request")
        const results = outApplyFilter.getResults(tmpAppliedSubFilters, tmpSelectedSubFilters)
        return {
            filtersIds: results[0],
            subFiltersIds: results[1],
            appliedSubFiltersIds: results[2],
            selectedSubFiltersIds: results[3],
            itemIds: results[4]
        }
    }

    // useCacheFilters ? cache : db()
    return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
                //console.log("cache-false: read from db()")
                loadSequence.loadFilterIds()
                .then(function() {
                    const results = outApplyFilter.getResults(tmpAppliedSubFilters, tmpSelectedSubFilters)
                    res3( {
                        filtersIds: results[0],
                        subFiltersIds: results[1],
                        appliedSubFiltersIds: results[2],
                        selectedSubFiltersIds: results[3],
                        itemIds: results[4]
                    })
                }).catch(function (error) {console.log('mistake!', error)})
            } else {
                const results = outApplyFilter.getResults(tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filtersIds: results[0],
                    subFiltersIds: results[1],
                    appliedSubFiltersIds: results[2],
                    selectedSubFiltersIds: results[3],
                    itemIds: results[4]
                })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
})



export const applyFromSubFilterNow  = functions.https.onCall((data, context) => {   
  //  console.log('useCacheFilters', useCacheFilters);
    const tmpAppliedSubFilters = new Set()
    const tmpSelectedSubFilters = new Set()
    userCache.parseDataApplying(data, tmpAppliedSubFilters, tmpSelectedSubFilters)

    const filterId = data.filterId

     // force read from db
     if (helper.dictCount(applyLogic.filters) === 0 ||
     helper.dictCount(applyLogic.subFilters) === 0 || 
     helper.dictCount(applyLogic.subfiltersByFilter) === 0||
     helper.dictCount(applyLogic.subfiltersByItem) === 0 ||
     helper.dictCount(applyLogic.itemsBySubfilter) === 0) {
       //  console.log("force: read from db()")
         return new Promise((res3, reject) => {
            loadSequence.loadFilterIds()
             .then(function() {
                const results = outApplySubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filtersIds: results[0],
                    subFiltersIds: results[1],
                    appliedSubFiltersIds: results[2],
                    selectedSubFiltersIds: results[3],
                    countItemsBySubfilter: results[4]
                })
             }).catch(function (error) {console.log('mistake!', error)})
         })    
    }


    // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
       // console.log("read from cache by mobile request")
       const results = outApplySubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
       return{
           filtersIds: results[0],
           subFiltersIds: results[1],
           appliedSubFiltersIds: results[2],
           selectedSubFiltersIds: results[3],
           countItemsBySubfilter: results[4]
       }
    }

     // useCacheFilters ? cache : db()
     return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
              //  console.log("cache-false: read from db()")
              loadSequence.loadFilterIds()
                .then(function() {
                    const results = outApplySubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                    res3( {
                        filtersIds: results[0],
                        subFiltersIds: results[1],
                        appliedSubFiltersIds: results[2],
                        selectedSubFiltersIds: results[3],
                        countItemsBySubfilter: results[4]
                    })
                }).catch(function (error) {console.log('mistake!', error)})
            } else {
                const results = outApplySubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filtersIds: results[0],
                    subFiltersIds: results[1],
                    appliedSubFiltersIds: results[2],
                    selectedSubFiltersIds: results[3],
                    countItemsBySubfilter: results[4]
                })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
})



export const fullFilterEntities  = functions.https.onCall((data, context) => {   
    // console.log('useCacheFilters', useCacheFilters);

    // force read from db
    if (helper.dictCount(applyLogic.filters) === 0 ||
        helper.dictCount(applyLogic.subFilters) === 0 || 
        helper.stringIsNullOrEmpty(filtersJson) ||
        helper.stringIsNullOrEmpty(subFiltersJson)) {
            return loadSequence.loadFilterEntities()
    }

    // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
        return{
            filters: filtersJson,
            subFilters: subFiltersJson
        }
    }

    // useCacheFilters ? cache : db()
    return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
                res3(loadSequence.loadFilterEntities())
            } else {
                res3( {
                    filters: filtersJson,
                    subFilters: subFiltersJson
                })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
})




export const currSubFilterIds  = functions.https.onCall((data, context) => {   
  // console.log('useCacheFilters', useCacheFilters);
    const tmpAppliedSubFilters = new Set()
    const tmpSelectedSubFilters = new Set()

    const arr = data.appliedSubFilters
    applyLogic.setAppliedSubFilters(arr, tmpAppliedSubFilters)
    const filterId = data.filterId


    
    
    // force read from db
    if (helper.dictCount(applyLogic.filters) === 0 ||
        helper.dictCount(applyLogic.subFilters) === 0 || 
        helper.dictCount(applyLogic.subfiltersByFilter) === 0||
        helper.dictCount(applyLogic.subfiltersByItem) === 0 ||
        helper.dictCount(applyLogic.itemsBySubfilter) === 0) {
         //   console.log("force: read from db()")
            return new Promise((res3, reject) => {
                loadSequence.loadFilterIds()
                .then(function() {
                    const result = outEnterSubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                    res3( {
                        filterId: result[0],
                        subFiltersIds: result[1],
                        appliedSubFiltersIds: result[2],
                        countItemsBySubfilter: result[3]
                    })
                }).catch(function (error) {console.log('mistake!', error)})
            })    
    }

    // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
      //  console.log("read from cache by mobile request")
        const result = outEnterSubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
        return{
            filterId: result[0],
            subFiltersIds: result[1],
            appliedSubFiltersIds: result[2],
            countItemsBySubfilter: result[3]
        }
    }


    // useCacheFilters ? cache : db()
    return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
          //      console.log("cache-false: read from db()")
                loadSequence.loadFilterIds()
                    .then(function() {
                        const result = outEnterSubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                        res3( {
                            filterId: result[0],
                            subFiltersIds: result[1],
                            appliedSubFiltersIds: result[2],
                            countItemsBySubfilter: result[3]
                        })
                    }).catch(function (error) {console.log('mistake!', error)})
            } else {
                const result = outEnterSubfilter.getResults(filterId, tmpAppliedSubFilters, tmpSelectedSubFilters)
                res3( {
                    filterId: result[0],
                    subFiltersIds: result[1],
                    appliedSubFiltersIds: result[2],
                    countItemsBySubfilter: result[3]
                })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
   
})



export const catalogEntities  = functions.https.onCall((data, context) => {   
    console.log('useCacheFilters', useCacheFilters);
    const categoryId = data.categoryId as number
    const itemIds = data.itemsIds as number[]

     // force read from db
     if (helper.dictCount(itemsByCatalog) === 0 || 
         helper.dictCount(itemsById) === 0
     ) {
         console.log("force: read from db()")
         return new Promise((res3, reject) => {
            loadSequence.loadCatalogIds()
             .then(function() {
                const json = outCatalog.getResults(categoryId, itemIds)
                res3({
                    items: json
                })
             }).catch(function (error) {console.log('mistake!', error)})
         })    
    }


    // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
        console.log("read from cache by mobile request")
        const json = outCatalog.getResults(categoryId, itemIds)
        return {
            items: json
        }
    }

    // useCacheFilters ? cache : db()
    return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
                loadSequence.loadCatalogIds()
                .then(function() {
                    console.log("cache-false: read from db()")
                    const json = outCatalog.getResults(categoryId, itemIds)
                    res3({
                        items: json
                    })
                }).catch(function (error) {console.log('mistake!', error)})
            } else {
                console.log("read from cache")
                const json = outCatalog.getResults(categoryId, itemIds)
                    res3({
                        items: json
                    })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
})

export const catalogTotal  = functions.https.onCall((data, context) => {
    console.log('useCacheFilters', useCacheFilters);
    const categoryId = data.categoryId as number
    const perfetchLimitJson = JSON.stringify({"fetchLimit" : String(prefetchLimit)})


     // force read from db
     if ( helper.dictCount(itemsByCatalog) === 0) {
         console.log("force: read from db()")
         return new Promise((res3, reject) => {
            loadSequence.loadCatalogIds()
             .then(function() {
                const result = outCatalogTotal.getResults(categoryId)
                res3({
                    itemIds: result,
                    fetchLimit: perfetchLimitJson
                })
             }).catch(function (error) {console.log('mistake!', error)})
         })    
    }


    // read from cache by mobile request
    if (userCache.useGlobalCache(data)) {
        console.log("read from cache by mobile request")
        const result = outCatalogTotal.getResults(categoryId)
        return {
            itemIds: result,
            fetchLimit: perfetchLimitJson
        }
    }

    // useCacheFilters ? cache : db()
    return new Promise((res3, reject) => {
        loadFirebase.checkCache_Filters()
        .then(function() {
            if (useCacheFilters === false){
                loadSequence.loadCatalogIds()
                .then(function() {
                    console.log("cache-false: read from db()")
                    const result = outCatalogTotal.getResults(categoryId)
                    res3({
                        itemIds: result,
                        fetchLimit: perfetchLimitJson
                    })
                }).catch(function (error) {console.log('mistake!', error)})
            } else {
                console.log("read from cache")
                const result = outCatalogTotal.getResults(categoryId)
                    res3({
                        itemIds: result,
                        fetchLimit: perfetchLimitJson
                    })
            }
        }).catch(function (error) {console.log('mistake!', error)})
    })
    
})
