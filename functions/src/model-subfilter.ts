
export class SubFilterModel {
    
    id:number = 0;
    filterId:number = 0
    title: String = ""
    sectionHeader: String = ""
    enabled:Boolean = true


    constructor(filterId: number, id: number, title: String, sectionHeader: String, enabled: Boolean) {
        this.filterId = filterId
        this.id = id;
        this.title = title
        this.sectionHeader = sectionHeader
        this.enabled = enabled
    }
}