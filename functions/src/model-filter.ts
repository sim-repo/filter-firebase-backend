

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

    constructor(id: number, title: String, categoryId: number, filterEnum: FilterEnum, enabled: Boolean) {
        this.id = id;
        this.title = title
        this.categoryId = categoryId
        this.filterEnum = filterEnum
        this.enabled = enabled
    }
}