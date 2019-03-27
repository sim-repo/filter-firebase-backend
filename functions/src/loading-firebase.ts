
import * as admin from 'firebase-admin';
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';
import { CatalogModel } from './model-catalog';
import { UIDModel } from './model-uuid';
import { RangePrice } from './model-range-price';
import * as m from './index';
import { CacheFiltersByCategory } from './cache-filters-by-category';
import {CacheCrossFilters} from './cache-cross-filters'


// ********* cache controls: ***********
export function checkCache_Filters() {
    return admin.database().ref("/updateCacheFilters").once('value')
    .then(function(snapshot) {
        const useCache = snapshot.val() === 1 ? false : true
        m.setCache_Filters(useCache)
    })
    .catch(function (error) {
        console.log('There has been a horrible mistake!', error);
    })
}

export function checkCache_SubFilters() {
    admin.database().ref("/updateCacheSubfilters").once('value')
    .then(function(snapshot) {
        const useCache = snapshot.val() === 1 ? false : true
        m.setCache_Subfilters(useCache)
    })
    .catch(function (error) {
        console.log('There has been a horrible mistake!', error);
    })
}

export function checkCache_ItemsBySubfilter() {
    admin.database().ref("/updateCacheItemsBySubfilter").once('value')
    .then(function(snapshot) {
        const useCache = snapshot.val() === 1 ? false : true
        m.setCache_ItemsBySubfilter(useCache)
    })
    .catch(function (error) {
        console.log('There has been a horrible mistake!', error);
    })
}

export function checkCache_SubfiltersByFilter() {
    admin.database().ref("/updateCacheSubfiltersByFilter").once('value')
    .then(function(snapshot) {
        const useCache = snapshot.val() === 1 ? false : true
        m.setCache_SubfiltersByFilter(useCache)
    })
    .catch(function (error) {
        console.log('There has been a horrible mistake!', error);
    })
}

export function checkCache_SubfiltersByItem() {
    admin.database().ref("/updateCacheSubfiltersByItem").once('value')
    .then(function(snapshot) {
        const useCache = snapshot.val() === 1 ? false : true
        m.setCache_SubfiltersByItem(useCache)
    })
    .catch(function (error) {
        console.log('There has been a horrible mistake!', error);
    })
}

// ********* fill data: ***********

export function fillCategories() {
    return admin.database().ref("/categories/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const categoryId = childSnapshot.child("categoryId")
            if (m.cacheByCategory[categoryId.val()] == null) {
                m.cacheByCategory[categoryId.val()] = new CacheFiltersByCategory(categoryId.val())
            }   
        })
    })
}



export function fillUIDs() {
    return admin.database().ref("/uids/").once('value')
    .then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            const uid = childSnapshot.child("uid")
            const filterDataStructure = childSnapshot.child("type")
            const categoryId = childSnapshot.child("categoryId")
            const filterId = childSnapshot.child("filterId")
            const cross = childSnapshot.child("cross")
            

            const filterModel = new UIDModel(
                uid.val(),
                filterDataStructure.val(),
                categoryId.val(),
                filterId.val(),
                cross.val()
            )
            m.uids.push(filterModel)
        })
        m.setUidJSON()
    });
}


export function fillFilters() {
    return admin.database().ref("/filters/").once('value')
    .then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            const categoryId = childSnapshot.child("categoryId")
            const id = childSnapshot.child("id")
            const filterEnum = childSnapshot.child("filterEnum")
            const title = childSnapshot.child("title")
            const enabled = childSnapshot.child("enabled")
            const cross = childSnapshot.child("cross")
            const uuid = childSnapshot.child("uuid")

            const filterModel = new FilterModel(
                id.val(),
                title.val(),
                categoryId.val(),
                filterEnum.val(),
                enabled.val(),
                cross.val(),
                uuid.val()
            )

            const category = m.cacheByCategory[categoryId.val()]
            if (category != null) {
                category.setFilters(filterModel)
            }
            
            if (filterModel.cross === true) {
                // for (const catId in m.cacheByCategory) {
                //     const cacheCategory = m.cacheByCategory[catId]
                //     cacheCategory.setFilters(filterModel)
                // }
                const cacheCross = CacheCrossFilters.getInstance()
                cacheCross.setFilters(filterModel)
            }
        })
    });
}


export function fillSubFilters(){
    return admin.database().ref("/subfilters/").once('value')
    .then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            const filterId = childSnapshot.child("filterId")
            const id = childSnapshot.child("id")
            const categoryId = childSnapshot.child("categoryId")
            const title = childSnapshot.child("title")
            const sectionHeader = childSnapshot.child("sectionHeader")
            const enabled = childSnapshot.child("enabled")
            const cross = childSnapshot.child("cross")

            const subFilterModel = new SubFilterModel(
                categoryId.val(),
                filterId.val(),
                id.val(),
                title.val(),
                sectionHeader.val(),
                enabled.val(),
                cross.val()
            )

            if (subFilterModel.cross === false) {
                const category = m.cacheByCategory[categoryId.val()]
                if (category != null) {
                    category.setSubfilters(subFilterModel)
                }
            } else {
                const cacheSingle = CacheCrossFilters.getInstance()
                cacheSingle.setSubfilters(subFilterModel)
            }
        })
    })
}



export function fillSubfiltersByItem(){
    return admin.database().ref("/subfiltersByItem/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const itemId = childSnapshot.child("id")
            const subfilters = childSnapshot.child("subfilters")
            const categoryId = childSnapshot.child("categoryId")

            const category = m.cacheByCategory[categoryId.val()]
            if (category != null) {
                category.setSubfiltersByItem(itemId.val(),  subfilters.val())
            }
        })
    })
}



export function fillItemsBySubfilter(){
    return admin.database().ref("/itemsBySubfilter/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const subfilterId = childSnapshot.child("id")
            const items = childSnapshot.child("items")
            const categoryId = childSnapshot.child("categoryId")

            const category = m.cacheByCategory[categoryId.val()]
            if (category != null) {
                category.setItemsBySubfilter(subfilterId.val(), items.val())
            }
        })
    })
}


export function fillPriceByItem(){
    return admin.database().ref("/pricesByItem/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const itemId = childSnapshot.child("id")
            const price = childSnapshot.child("price")
            const categoryId = childSnapshot.child("categoryId")

            const category = m.cacheByCategory[categoryId.val()]
            if (category != null) {
                category.setPriceByItem(itemId.val(), price.val())
            }
        })
    })
}


export function fillRangePriceByCategory(){
    return admin.database().ref("/rangePriceByCategory/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const categoryId = childSnapshot.child("id")
            const min = childSnapshot.child("minPrice")   
            const max = childSnapshot.child("maxPrice")
            const rangePrice = new RangePrice()
            rangePrice.categoryId = categoryId.val()
            rangePrice.userMinPrice = min.val()
            rangePrice.userMaxPrice = max.val()
            rangePrice.tipMinPrice = min.val()
            rangePrice.tipMaxPrice = max.val()

            const category = m.cacheByCategory[categoryId.val()]
            if (category != null) {
                category.setRangePrice(rangePrice)
            }
        })
    })
}


export function fillCatalog(){
    return admin.database().ref("/catalog/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const id = childSnapshot.child("id")
            const categoryId = childSnapshot.child("categoryId")
            const name = childSnapshot.child("name")
            const newPrice = childSnapshot.child("newPrice")
            const oldPrice = childSnapshot.child("oldPrice")
            const stars = childSnapshot.child("stars")
            const thumbnail = childSnapshot.child("thumbnail")                            
            const votes = childSnapshot.child("votes")   
            const discount = childSnapshot.child("discount")   
            const item = new CatalogModel(
                id.val(),
                categoryId.val(),
                name.val(),
                thumbnail.val(),
                stars.val(),
                newPrice.val(),
                oldPrice.val(),
                votes.val(),
                discount.val()
            )
            
            const category = m.cacheByCategory[categoryId.val()]
            if (category != null) {
                category.setItem(item)
            }
        })
    })
}

