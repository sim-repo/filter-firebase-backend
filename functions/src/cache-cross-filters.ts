
import { FilterModel } from './model-filter';
import { SubFilterModel } from './model-subfilter';
import * as helper from './helper';
import * as converter from './converter';
import * as m from './index';
import * as applyLogic from './main-applying-logic';

export class CacheCrossFilters {

    private static instance: CacheCrossFilters
    private constructor(){}

    public static getInstance(){
        return this.instance || (this.instance = new this())
    }

    //uuidByFilter: {[filterId: number]: String} = {}
    filters: { [id: number]: FilterModel } = {}
    subFilters: { [filterId: number]: SubFilterModel[] } = {}
    subfiltersByFilter: {[filterId: number]: number[] } = {}

    // for light and heavy client:
    filterJSON: { [id: number]: String } = {}
    subFiltersJSON: { [id: number]: String } = {}
    uuidByFilterJSON: String = ""

    // only for heavy client:
    subfiltersByFilterJSON: { [id: number]: String } = {}

    // prepare outputs:
    prepareLightClientOutputs() {
        for (const key in this.subFilters) {
            const subf = this.subFilters[key]
            this.subFiltersJSON[key] = converter.subfilterToJson(subf)
        }
        //this.uuidByFilterJSON = converter.dictionaryToJson2(this.uuidByFilter)
    }


    prepareHeavyClientOutputs() {
        if (helper.dictCount(this.filters) === 0 || 
        helper.dictCount(this.subFilters) === 0 ||
        helper.dictCount(this.subfiltersByFilter) === 0 ) {
            return
        }

        for (const filterId in this.filters) {
            const filter = this.filters[filterId]
            this.filterJSON[filterId] = converter.filterToJson(filter)
        }

        for (const filterId in this.subFilters) {
            const subf = this.subFilters[filterId]
            this.subFiltersJSON[filterId] = converter.subfilterToJson(subf)
        }

        for (const filterId in this.subfiltersByFilter) {
            const ids = this.subfiltersByFilter[filterId]
            const tmp: { [id: number]: number[] } = {}
            tmp[filterId] = ids
            this.subfiltersByFilterJSON[filterId] = converter.dictionaryArrToJson(tmp)
        }
        //this.uuidByFilterJSON = converter.dictionaryToJson2(this.uuidByFilter)
    }

    clear(){
        this.filters = null
        this.subFilters = null
        this.subfiltersByFilter = null
    }

    // setters:
    setFilters(filter: FilterModel) {
       // this.uuidByFilter[filter.id] = filter.uuid
        this.filters[filter.id] = filter
    }

    setSubfilters(subfilter: SubFilterModel) {
        if (this.subFilters[subfilter.filterId] == null) {
            this.subFilters[subfilter.filterId] = Array()
        }
        this.subFilters[subfilter.filterId].push(subfilter)

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
}