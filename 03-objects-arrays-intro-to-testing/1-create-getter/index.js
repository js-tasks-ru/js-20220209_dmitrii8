/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    let subpaths = path.split(".");

    return (obj) => {
        if (Object.keys(obj).length === 0) return;

        for (let subpath of subpaths) {
            obj = obj[subpath];
        }
        
        return obj;
    };
}
