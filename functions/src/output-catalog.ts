
import * as converter from './converter';
import { CatalogModel } from './model-catalog';


export let itemsById: { [id: number]: CatalogModel } = { };


export function getResults(data: any){

    const nextItemsIds = data.itemsIds as number[]

    const catalogModels: CatalogModel[] = new Array()

    if (nextItemsIds != null && nextItemsIds.length > 0) {   
        for(const id of nextItemsIds) {
            if(itemsById[id] != null) {
                catalogModels.push(itemsById[id])
            }
        }
    }

    const json = converter.catalogModelToJson(catalogModels)
    return {
        items: json
    }
}