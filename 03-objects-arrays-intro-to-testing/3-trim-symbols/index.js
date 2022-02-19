/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (typeof string === 'undefined') return undefined;
    if (typeof size === 'undefined') return string;
    if (string.length === 0 || size === 0) return "";
    if (string.length <= size) return string;

    const symbol = string[0];
    let counter = 0;
    let substr;
    for (let letter of string) {
        if (letter === symbol) ++counter;
        else break;
    }
    if (counter >= size) {
        substr = string.slice(0, size);
    } else {
        substr = string.slice(0, counter);
    }
    return substr + trimSymbols(string.slice(counter, string.length), size);
}
