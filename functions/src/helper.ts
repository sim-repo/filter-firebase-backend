// example of calc perfomance:
// let t0 = new Date().getTime()
// const applied = getApplied(appliedSubFilters_, subFilters_)
// let t1 = new Date().getTime()                                
// console.log("1: " + (t1 - t0) + " milliseconds.")

export function dictCount(dict: {}): number {
    if (dict == null) {
        return 0
    }
    return Object.keys(dict).length
}

export function dictFirstKey(dict: {}): string {
    if (dict == null) {
        return ""
    }
    return Object.keys(dict)[0];
}

export function intersect(a: Set<number>, b: Set<number>){
    return new Set([...a].filter(x => b.has(x)))
}

export function union(a: Set<number>, b: Set<number>) {
    return new Set([...a,...b])
}

export function substract(a: Set<number>, b: Set<number>){
    return new Set([...a].filter(x => !b.has(x)));
}

export function toNumber(num: any){
    return parseInt(num)
}

export function stringIsNullOrEmpty(value: String){
    return value == null || value === "" || value.length === 0;
}
