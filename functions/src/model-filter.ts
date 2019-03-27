

enum FilterEnum {
    select = "select",
    range = "range",
    section = "section"
}

export class FilterModel {
    id:number = 0;
    title: String = ""
    categoryId = 0
    filterEnum: FilterEnum = FilterEnum.select
    enabled:Boolean = true
    cross: Boolean = false
    uuid: String = ""

    constructor(id: number, 
                title: String, 
                categoryId: number, 
                filterEnum: FilterEnum, 
                enabled: Boolean, 
                cross: Boolean,
                uuid: String
                ) {

        this.id = id;
        this.title = title
        this.categoryId = categoryId
        this.filterEnum = filterEnum
        this.enabled = enabled
        this.cross = cross
        this.uuid = uuid
    }
}