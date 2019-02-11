
import * as admin from 'firebase-admin';
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';
import * as m from './index';
import { CatalogModel } from './model-catalog';
import * as applyLogic from './main-applying-logic'


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

export function fillFilters() {
    return admin.database().ref("/filters/").once('value')
    .then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            const categoryId = childSnapshot.child("categoryId")
            const id = childSnapshot.child("id")
            const filterEnum = childSnapshot.child("filterEnum")
            const title = childSnapshot.child("title")
            const enabled = childSnapshot.child("enabled")
            const filterModel = new FilterModel(
                id.val(),
                title.val(),
                categoryId.val(),
                filterEnum.val(),
                enabled.val()
            )
            applyLogic.filters[id.val()] = filterModel;
        })
    });
}


export function fillSubFilters(){
    return admin.database().ref("/subfilters/").once('value')
    .then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            const filterId = childSnapshot.child("filterId")
            const id = childSnapshot.child("id")
            const title = childSnapshot.child("title")
            const sectionHeader = childSnapshot.child("sectionHeader")
            const enabled = childSnapshot.child("enabled")
            const subFilterModel = new SubFilterModel(
                filterId.val(),
                id.val(),
                title.val(),
                sectionHeader.val(),
                enabled.val()
            )
            applyLogic.subFilters[id.val()] = subFilterModel;
        })
    })
}



export function fillSubfiltersByItem(){
    return admin.database().ref("/subfiltersByItem/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const id = childSnapshot.child("id")
            const subfilters = childSnapshot.child("subfilters")    
            applyLogic.subfiltersByItem[id.val()] = subfilters.val();
        })
    })
}


export function fillItemsBySubfilter(){
    return admin.database().ref("/itemsBySubfilter/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const id = childSnapshot.child("id")
            const items = childSnapshot.child("items")   
            applyLogic.itemsBySubfilter[id.val()] = items.val();
        })
    })
}

export function fillSubfiltersByFilter(){
    return admin.database().ref("/subfiltersByFilter/").once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const id = childSnapshot.child("id")
            const subfilters = childSnapshot.child("subfilters")   
            applyLogic.subfiltersByFilter[id.val()] = subfilters.val();
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
            const catalogModel = new CatalogModel(
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
            if (m.itemsByCatalog[categoryId.val()] == null) {
                m.itemsByCatalog[categoryId.val()] = new Array()
            }
            m.itemsByCatalog[categoryId.val()].push(catalogModel)
            
        })
    })
}

