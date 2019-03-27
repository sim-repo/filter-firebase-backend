import {CacheCrossFilters} from './cache-cross-filters'

export function getResults(data: any) {

    const filterId = data.filterId as number

    const cacheCross = CacheCrossFilters.getInstance()

    const filterJSON: String = cacheCross.filterJSON[filterId]
    const subfiltersJSON: String = cacheCross.subFiltersJSON[filterId]
    const subfiltersByFilterJSON: String = cacheCross.subfiltersByFilterJSON[filterId]

    return {
        filter: filterJSON,
        subFilters: subfiltersJSON,
        subfiltersByFilter: subfiltersByFilterJSON
    }
}