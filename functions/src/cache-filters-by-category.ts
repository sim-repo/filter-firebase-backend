
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';
import { CatalogModel } from './model-catalog';
import { RangePrice } from './model-range-price';
import * as converter from './converter';
import * as m from './index';
import * as applyLogic from './main-applying-logic';
import * as outputCatalog from './output-catalog'
import * as helper from './helper';

export class CacheFiltersByCategory {

    categoryId = 0

    itemIds: number[] = []
    items: CatalogModel[] = []

    filters: { [id: number]: FilterModel } = {};
    subFilters: { [id: number]: SubFilterModel } = {};
    subfiltersByFilter: {[id: number]: number[] } = {};
    
    itemsBySubfilter: {[id: number]: number[] } = {};
    priceByItem: {[id: number]: number } = {};
    subfiltersByItem: {[id: number]: number[] } = {};
    rangePrice: RangePrice;

    // for light and heavy client:
    filtersJSON: String  = ""
    subFiltersJSON: String  = ""
    itemsIdsJSON: String = ""
    userMinPriceJSON: String = ""
    userMaxPriceJSON: String = ""


    // only for heavy client:
    subfiltersByFilterJSON: String  = ""
    subfiltersByItemJSON: String  = ""
    itemsBySubfilterJSON: String  = ""
    priceByItemJSON: String  = ""

    constructor(categoryId: number) {
        this.categoryId = categoryId
    }

    // prepare outputs:
    prepareLightClientOutputs() {
        this.filtersJSON = converter.filtersToJson(this.filters)
        this.subFiltersJSON = converter.subfiltersToJson(this.subFilters)
        this.itemsIdsJSON = converter.arrToJson(this.itemIds)
        this.userMinPriceJSON = JSON.stringify({"minPrice": String(this.rangePrice.userMinPrice)})   
        this.userMaxPriceJSON = JSON.stringify({"maxPrice": String(this.rangePrice.userMaxPrice)}) 
    }

    prepareHeavyClientOutputs() {
        if (helper.dictCount(this.filters) === 0 || 
        helper.dictCount(this.subFilters) === 0 ||
        helper.dictCount(this.subfiltersByFilter) === 0 ||
        helper.dictCount(this.itemsBySubfilter) === 0 ||
        helper.dictCount(this.priceByItem) === 0 ||
        helper.dictCount(this.subfiltersByItem) === 0 ||
        this.rangePrice == null) {
            console.log("filters : " + helper.dictCount(this.filters))
            console.log("subFilters : " + helper.dictCount(this.subFilters))
            console.log("subfiltersByFilter : " + helper.dictCount(this.subfiltersByFilter))
            console.log("itemsBySubfilter : " + helper.dictCount(this.itemsBySubfilter))
            console.log("priceByItem : " + helper.dictCount(this.priceByItem))
            console.log("subfiltersByItem : " + helper.dictCount(this.subfiltersByItem))
            return
        }
       
        this.filtersJSON = converter.filtersToJson(this.filters)
        this.subFiltersJSON = converter.subfiltersToJson(this.subFilters)
        this.itemsIdsJSON = converter.arrToJson(this.itemIds)
        this.userMinPriceJSON = JSON.stringify({"minPrice": String(this.rangePrice.userMinPrice)})   
        this.userMaxPriceJSON = JSON.stringify({"maxPrice": String(this.rangePrice.userMaxPrice)})  

        this.subfiltersByFilterJSON = converter.dictionaryArrToJson(this.subfiltersByFilter)
        this.subfiltersByItemJSON = converter.dictionaryArrToJson(this.subfiltersByItem)
        this.itemsBySubfilterJSON = converter.dictionaryArrToJson(this.itemsBySubfilter)
        this.priceByItemJSON = converter.dictionaryToJson(this.priceByItem)
    }


    clear(){
        this.itemIds = null
        this.filters = null
        this.subFilters = null
        this.subfiltersByFilter = null
        this.itemsBySubfilter = null
        this.priceByItem = null
        this.subfiltersByItem = null
    }

    // setters:
    setFilters(filter: FilterModel) {
        this.filters[filter.id] = filter
    }

    setSubfilters(subfilter: SubFilterModel) {
        this.subFilters[subfilter.id] = subfilter

        if (m.clientMode === m.ClientMode.Heavy) {
            if (this.subfiltersByFilter[subfilter.filterId] == null) {
                this.subfiltersByFilter[subfilter.filterId] = new Array()
            }
            this.subfiltersByFilter[subfilter.filterId].push(subfilter.id)
        }

        if (m.clientMode === m.ClientMode.Light) {
            if (applyLogic.subfiltersByFilter[subfilter.filterId] == null) {
                applyLogic.subfiltersByFilter[subfilter.filterId] = new Array()
            }
            applyLogic.subfiltersByFilter[subfilter.filterId].push(subfilter.id)
        }
    }

    setSubfiltersByItem(itemId: number, subfilterIds: number[]){
        if (m.clientMode === m.ClientMode.Heavy) {
            this.subfiltersByItem[itemId] = subfilterIds
        }
        if (m.clientMode === m.ClientMode.Light) {
            applyLogic.subfiltersByItem[itemId] = subfilterIds
        }
    }

    setItemsBySubfilter(subfilterId: number, itemIds: number[]){
        if (m.clientMode === m.ClientMode.Heavy) {
            this.itemsBySubfilter[subfilterId] = itemIds
        }
        if (m.clientMode == m.ClientMode.Light) {
            applyLogic.itemsBySubfilter[subfilterId] = itemIds
        }
    }

    setPriceByItem(itemId: number, price: number){
        if (m.clientMode === m.ClientMode.Heavy) {
            this.priceByItem[itemId] = price
        }
        if (m.clientMode === m.ClientMode.Light) {
            applyLogic.priceByItem[itemId] = price
        }
    }

    setRangePrice(rangePrice: RangePrice){
        this.rangePrice = rangePrice
    }

    setItem(item: CatalogModel){
        this.itemIds.push(item.id)
        this.items.push(item) 
        outputCatalog.itemsById[item.id] = item
    }
}