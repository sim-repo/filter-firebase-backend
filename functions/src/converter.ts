import { CatalogModel } from './model-catalog';
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';
import { UIDModel } from './model-uuid';



export function arrToJson(arr:number[]) : String {
    const obj : {[id: string]: number[]} = {}
    obj["items"] = []
    arr.forEach(id => obj["items"].push(id))
    const json = JSON.stringify(obj)
    return json
}

export function catalogModelToJson(arr:CatalogModel[]) : String {
    const obj : {[id: string]: CatalogModel[]} = {}
    obj["items"] = []
    arr.forEach(id => obj["items"].push(id))
    const json = JSON.stringify(obj)
    return json
}

//*** Filters ***//
export function dictionaryToJson(dict: {[id: number]:number}) : String {
    const obj : {[id: string]: {[id:number]:number}[]} = {}
    obj["items"] = []
    for (const subfID in dict) {
         const id = parseInt(subfID) 
         const o: {[id:number]:number} = {}
         o[id] = dict[subfID]
         obj["items"].push(o)
    }
    const json = JSON.stringify(obj)
    return json
}

export function dictionaryToJson2(dict: {[id: number]:String}) : String {
    const obj : {[id: string]: {[id:number]:String}[]} = {}
    obj["items"] = []
    for (const key in dict) {
         const id = parseInt(key) 
         const o: {[id:number]:String} = {}
         o[id] = dict[key]
         obj["items"].push(o)
    }
    const json = JSON.stringify(obj)
    return json
}


export function filtersToJson(dict: {[id: number]:FilterModel}) : String {
    const obj : {[id: string]: FilterModel[]} = {}
    obj["items"] = []
    for (const key in dict) {
        const model = dict[key]
        obj["items"].push(model)
    }
    const json = JSON.stringify(obj)
    return json
}

export function filterToJson(filter: FilterModel) : String {
    const obj : {[id: string]: FilterModel[]} = {}
    obj["items"] = []
    obj["items"].push(filter)
    const json = JSON.stringify(obj)
    return json
}

export function uidsToJson(uids: UIDModel[]) : String {
    const obj : {[id: string]: UIDModel[]} = {}
    obj["items"] = []
    obj["items"]= uids
    const json = JSON.stringify(obj)
    return json
}



export function subfiltersToJson(dict: {[id: number]:SubFilterModel}) : String {
    const obj : {[id: string]: SubFilterModel[]} = {}
    obj["items"] = []
    for (const key in dict) {
        const model = dict[key]
        obj["items"].push(model)
    }
    const json = JSON.stringify(obj)
    return json
}

export function subfilterToJson(arr: SubFilterModel[]) : String {
    const obj : {[id: string]: SubFilterModel[]} = {}
    obj["items"] = []
    arr.forEach(id => obj["items"].push(id))
    const json = JSON.stringify(obj)
    return json
}


export function dictionaryArrToJson(dict: {[id: number]:number[]}) : String {
    const obj : {[id: string]: {[id:number]:number[]}} = {}
    obj["items"] = dict
    const json = JSON.stringify(obj)
    return json
}



export function singleToJson(key: String, val: String) : String {
    return JSON.stringify({key : val})
}
