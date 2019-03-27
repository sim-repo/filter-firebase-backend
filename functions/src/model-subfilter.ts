
export class SubFilterModel {
    
    id:number = 0;
    categoryId: number = 0
    filterId:number = 0
    title: String = ""
    sectionHeader: String = ""
    enabled:Boolean = true
    cross: Boolean = false


    constructor(categoryId: number, 
                filterId: number, 
                id: number, 
                title: String, 
                sectionHeader: String, 
                enabled: Boolean,
                cross: Boolean
                ) {

        this.categoryId = categoryId
        this.filterId = filterId
        this.id = id;
        this.title = title
        this.sectionHeader = sectionHeader
        this.enabled = enabled
        this.cross = cross
    }
}