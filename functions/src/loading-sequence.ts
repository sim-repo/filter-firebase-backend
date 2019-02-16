
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

        Promise.all([p1, p2, p3, p4, p5]).then(values => { 
            m.setFiltersJson(converter.filterToJson(applyLogic.filters))
            m.setSubfiltersJson(converter.subfilterToJson(applyLogic.subFilters))
            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}




export function loadCatalogIds(): Promise<void | {}>{
    return new Promise((res2, reject) => {
        const p1= new Promise((res, rej) => {//1
            res(dataload.fillCatalog())
        }); 
        Promise.all([p1]).then(values => { 
            res2(1);
        })
        .catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}