
export class RangePrice {
    
    categoryId:number = 0;
    minPrice:number = 0
    maxPrice:number = 0

    constructor(categoryId: number, minPrice: number, maxPrice: number) {
        this.categoryId = categoryId
        this.minPrice = minPrice;
        this.maxPrice = maxPrice
    }
}