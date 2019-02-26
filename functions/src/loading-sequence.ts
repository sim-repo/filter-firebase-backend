
import * as m from './index';
import * as dataload from './loading-firebase';
import * as converter from './converter';
import * as applyLogic from './main-applying-logic'


export function loadFilterEntities(): Promise<void | {}>{
    return new Promise((res2, reject) => {
        const p1 = new Promise((res, rej) => {
            res(dataload.fillFilters())
        }); 

        const p2= new Promise((res, rej) => {
            res(dataload.fillSubFilters())
        }); 

        Promise.all([p1, p2]).then(values => { 
            m.setFiltersJson(converter.filterToJson(applyLogic.filters))
            m.setSubfiltersJson(converter.subfilterToJson(applyLogic.subFilters))

            res2( {
                filters: m.filtersJson,
                subFilters: m.subFiltersJson
            });
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}



export function loadHeavyFilterEntities(): Promise<void | {}>{

    return new Promise((res2, reject) => {
        const p1 = new Promise((res, rej) => {
            res(dataload.fillSubfiltersByItem())
        }); 

        const p2= new Promise((res, rej) => {
            res(dataload.fillItemsBySubfilter())
        }); 

        const p3= new Promise((res, rej) => {
            res(dataload.fillSubfiltersByFilter())
        }); 

        const p4 = new Promise((res, rej) => {
            res(dataload.fillFilters())
        }); 

        const p5= new Promise((res, rej) => {
            res(dataload.fillSubFilters())
        }); 

        const p6 = new Promise((res, rej) => {
            res(dataload.fillPriceByItem())
        });


        Promise.all([p1, p2, p3, p4, p5, p6]).then(values => { 
            m.setFiltersJson(converter.filterToJson(applyLogic.filters))
            m.setSubfiltersJson(converter.subfilterToJson(applyLogic.subFilters))
            m.setItemsBySubfilterJson(converter.dictionaryArrToJson(applyLogic.itemsBySubfilter))
            m.setPriceByItemIdJson(converter.dictionaryToJson(applyLogic.priceByItemId))
            m.setSubfiltersByFilterJson(converter.dictionaryArrToJson(applyLogic.subfiltersByFilter))
            m.setSubfiltersByItemJson(converter.dictionaryArrToJson(applyLogic.subfiltersByItem))

            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}




export function loadFilterIds(): Promise<void | {}>{

    return new Promise((res2, reject) => {
        const p1 = new Promise((res, rej) => {
            res(dataload.fillSubfiltersByItem())
        }); 

        const p2= new Promise((res, rej) => {
            res(dataload.fillItemsBySubfilter())
        }); 

        const p3= new Promise((res, rej) => {
            res(dataload.fillSubfiltersByFilter())
        }); 

        const p4 = new Promise((res, rej) => {
            res(dataload.fillFilters())
        }); 

        const p5= new Promise((res, rej) => {
            res(dataload.fillSubFilters())
        }); 

        const p6 = new Promise((res, rej) => {
            res(dataload.fillPriceByItem())
        });


        Promise.all([p1, p2, p3, p4, p5, p6]).then(values => { 
            m.setFiltersJson(converter.filterToJson(applyLogic.filters))
            m.setSubfiltersJson(converter.subfilterToJson(applyLogic.subFilters))
            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}



export function loadCatalogIds(): Promise<void | {}>{
    return new Promise((res2, reject) => {
        const p1= new Promise((res, rej) => {
            res(dataload.fillCatalog())
        }); 
        Promise.all([p1]).then(values => { 
            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}



export function loadTotals(): Promise<void | {}>{
    return new Promise((res2, reject) => {
        const p1= new Promise((res, rej) => {
            res(dataload.fillCatalog())
        }); 

        const p2 = new Promise((res, rej) => {
            res(dataload.fillRangePriceByCategory())
        });

        Promise.all([p1, p2]).then(values => { 
            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}


export function loadApplyByPrices(): Promise<void | {}> {
    return new Promise((res2, reject) => {

        const p1= new Promise((res, rej) => {
            res(dataload.fillPriceByItem())
        }); 
        
        const p2 = new Promise((res, rej) => {
            res(dataload.fillFilters())
        }); 

        const p3= new Promise((res, rej) => {
            res(dataload.fillSubFilters())
        }); 

        const p4 = new Promise((res, rej) => {
            res(dataload.fillSubfiltersByItem())
        }); 

        Promise.all([p1, p2, p3, p4]).then(values => { 
            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}