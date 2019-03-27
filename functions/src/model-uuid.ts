


export class UIDModel {

    uid: String = ""
    type: String = ""
    filterId:number = 0;
    categoryId = 0
    cross: Boolean = false
    

    constructor(uid: String,
                type: String, 
                categoryId: number, 
                filterId: number, 
                cross: Boolean
                ) {

        this.uid = uid;
        this.type = type
        this.categoryId = categoryId
        this.filterId = filterId
        this.cross = cross
    }
}