/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if(typeof obj !== 'undefined') {
        return Object.fromEntries(Object.entries(obj).map(arr => arr.reverse()));
    } else {
        return undefined;
    }
    
}
