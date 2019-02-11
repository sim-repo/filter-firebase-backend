

export class CatalogModel {

    id:number = 0;
    categoryId:number = 0
    name: String = ""
    thumbnail: String = ""
    stars: String = ""
    newPrice: String = ""
    oldPrice: String = ""
    votes: number = 0
    discount: number = 0


    constructor(id: number, categoryId: number, name: String, thumbnail: String, stars: String, newPrice: String, oldPrice: String, votes: number, discount: number) {
        this.id = id
        this.categoryId = categoryId;
        this.name = name
        this.thumbnail = thumbnail
        this.stars = stars
        this.newPrice = newPrice
        this.oldPrice = oldPrice
        this.votes = votes
        this.discount = discount
    }
}