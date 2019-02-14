
import * as m from './index';
import * as converter from './converter';
import { CatalogModel } from './model-catalog';

export function getResults(categoryId: number, nextItemsIds: number[]){

    const next:CatalogModel[] = new Array()


    if (nextItemsIds != null && nextItemsIds.length > 0) {   
        for(const id of nextItemsIds) {
            if(m.itemsById[id] != null) {
                next.push(m.itemsById[id])
            }
        }
    }

    const json = converter.arrToJson2(next)
    return json
}