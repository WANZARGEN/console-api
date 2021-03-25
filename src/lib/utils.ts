import _ from 'lodash';

export const pageItems = (items, page) => {
    if (page.start) {
        if (page.limit) {
            return items.slice((page.start-1), (page.start+page.limit-1));
        } else {
            return items.slice(page.start-1);
        }
    }

    return items;
};

export const filterItems = (items, keyword, filterKeys) => {
    return _.filter(items, function(item) {
        return filterKeys.some((key) => {
            const value = getObjectValue(item, key);
            if (Array.isArray(value)) {
                return value.some((v) => {
                    return String(v).indexOf(keyword) >= 0;
                });
            } else {
                return String(value).indexOf(keyword) >= 0;
            }
        });
    });
};

export const sortItems = (items, sort) => {
    if (sort.desc === true) {
        return _.sortBy(items, sort.key).reverse();
    } else {
        return _.sortBy(items, sort.key);
    }
};

export const getObjectValue = (object, dottedKey) => {
    if (dottedKey.indexOf('.') >= 0) {
        const key = dottedKey.split('.')[0];
        let rest = dottedKey.slice(dottedKey.indexOf('.')+1);

        if (key in object) {
            if (Array.isArray(object[key])) {
                // Array Values
                let values = object[key];

                if (rest.indexOf('.' >= 0)) {
                    const restKey = rest.split('.')[0];

                    if (typeof restKey == 'number') {
                        const index = parseInt(restKey);
                        const nextRest = rest.slice(rest.indexOf('.')+1);
                        if (index >= object[key].length) {
                            return null;
                        } else {
                            values = [object[key][index]];
                            rest = nextRest;
                        }
                    }
                } else {
                    if (typeof rest == 'number') {
                        if (rest >= object[key].length) {
                            return null;
                        } else {
                            return object[key];
                        }
                    }
                }

                const data = [];
                values.forEach((item) => {
                    const result = getObjectValue(item, rest);
                    if (result !== null) {
                        if(Array.isArray(result)) {
                            Array.prototype.push.apply(data, result);
                        } else {
                            data.push(result);
                        }
                    }
                });

                return data;
            } else {
                // Object Value
                return getObjectValue(object[key], rest);
            }
        } else {
            return null;
        }
    } else {
        if (dottedKey in object) {
            return object[dottedKey];
        } else {
            return null;
        }
    }
};

export const tagsToObject = (tags) => {
    const tagsObject = {};
    tags.forEach((tag) => {
        tagsObject[tag.key] = tag.value;
    });
    return tagsObject;
};

export const getValueByPath = (data, path) => {
    let target = data;
    const pathArr = path.split('.');

    for (let i = 0; i < pathArr.length; i++) {
        if (target === undefined || target === null || typeof target !== 'object') return target;

        const currentPath = pathArr[i];

        if (Array.isArray(target)) {
            if (Number.isNaN(Number(currentPath))) {
                target = target.map(d => d[currentPath]);
            } else {
                target = target[Number(currentPath)];
            }
        } else {
            target = target[currentPath];
        }
    }

    return target;
};
