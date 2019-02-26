import { CatalogModel } from './model-catalog';
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';


export function arrToJson(arr:number[]) : String {
    const obj : {[id: string]: number[]} = {}
    obj["items"] = []
    arr.forEach(id => obj["items"].push(id))
    const json = JSON.stringify(obj)
    return json
}

export function arrToJson2(arr:CatalogModel[]) : String {
    const obj : {[id: string]: CatalogModel[]} = {}
    obj["items"] = []
    arr.forEach(id => obj["items"].push(id))
    const json = JSON.stringify(obj)
    return json
}

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


export function filterToJson(dict: {[id: number]:FilterModel}) : String {
    const obj : {[id: string]: FilterModel[]} = {}
    obj["items"] = []
    for (const key in dict) {
        const model = dict[key]
        obj["items"].push(model)
    }
    const json = JSON.stringify(obj)
    return json
}

export function subfilterToJson(dict: {[id: number]:SubFilterModel}) : String {
    const obj : {[id: string]: SubFilterModel[]} = {}
    obj["items"] = []
    for (const key in dict) {
        const model = dict[key]
        obj["items"].push(model)
    }
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
