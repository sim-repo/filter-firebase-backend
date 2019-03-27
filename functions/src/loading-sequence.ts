
import * as dataload from './loading-firebase';
import * as m from './index';
import {CacheCrossFilters} from './cache-cross-filters'


export function loadGlobalCache(): Promise<void | {}> {
    return new Promise((res1, reject) => {

        dataload.fillCategories()
        .then(values => {

            const p1= new Promise((res, rej) => {
                res(dataload.fillFilters())
            }); 

            const p2= new Promise((res, rej) => {
                res(dataload.fillSubFilters())
            }); 

            const p3= new Promise((res, rej) => {
                res(dataload.fillItemsBySubfilter())
            }); 
          
            const p4= new Promise((res, rej) => {
                res(dataload.fillPriceByItem())
            }); 

            const p5= new Promise((res, rej) => {
                res(dataload.fillRangePriceByCategory())
            }); 

            const p6= new Promise((res, rej) => {
                res(dataload.fillSubfiltersByItem())
            }); 

            const p7= new Promise((res, rej) => {
                res(dataload.fillCatalog())
            }); 

            const p8= new Promise((res, rej) => {
                res(dataload.fillUIDs())
            }); 
    
            Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]).then(values2 => { 

                const cacheSingle = CacheCrossFilters.getInstance()
                if (m.clientMode === m.ClientMode.Heavy) {
                    cacheSingle.prepareHeavyClientOutputs()
                } 
                if (m.clientMode === m.ClientMode.Light) {
                    cacheSingle.prepareLightClientOutputs()
                } 

                for (const id in m.cacheByCategory){
                    const store = m.cacheByCategory[Number(id)]
                   
                    if (m.clientMode === m.ClientMode.Heavy) {
                        store.prepareHeavyClientOutputs()
                    }
                    if (m.clientMode === m.ClientMode.Light) {
                        store.prepareLightClientOutputs()
                    }
                }

                res1(1);
            }).catch(function (error) {console.log('mistake!', error)})
        }).catch(function (error) {console.log('mistake!', error)})
    }).catch(function (error) {console.log('mistake!', error)})
}