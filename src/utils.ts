export function compareObjects(o: any, p: any) {
    var i, keysO = Object.keys(o).sort(), keysP = Object.keys(p).sort();
    if (keysO.length !== keysP.length) return false;//not the same nr of keys
    if (keysO.join('') !== keysP.join('')) return false;//different keys
    for (i = 0; i < keysO.length; ++i) {
        if (o[keysO[i]] instanceof Array) {
            if (!(p[keysO[i]] instanceof Array)) return false;
            //if (compareObjects(o[keysO[i]], p[keysO[i]] === false) return false
            //would work, too, and perhaps is a better fit, still, this is easy, too
            if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join('')) return false;
        } else if (o[keysO[i]] instanceof Date) {
            if (!(p[keysO[i]] instanceof Date)) return false;
            if (('' + o[keysO[i]]) !== ('' + p[keysO[i]])) return false;
        } else if (o[keysO[i]] instanceof Function) {
            if (!(p[keysO[i]] instanceof Function)) return false;
            //ignore functions, or check them regardless?
        } else if (o[keysO[i]] instanceof Object) {
            if (!(p[keysO[i]] instanceof Object)) return false;
            if (o[keysO[i]] === o) {
                if (p[keysO[i]] !== p) return false;
            } else if (compareObjects(o[keysO[i]], p[keysO[i]]) === false) return false;
        }
        if (o[keysO[i]] !== p[keysO[i]]) return false;
    }
    return true;
}

export function getContrastColor(hexColor: string): string {
    const color = hexColor.replace(/^#/, '');

    const r = parseInt(color.slice(0, 2), 16) / 255;
    const g = parseInt(color.slice(2, 4), 16) / 255;
    const b = parseInt(color.slice(4, 6), 16) / 255;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}