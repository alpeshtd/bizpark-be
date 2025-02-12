const { ObjectId } = require('mongoose').Types;

function stringIdToObjectId(filters, keys) {
    for (let key in filters) {
        if (keys.includes(key) && typeof filters[key] === 'string' && filters[key]) {
            filters[key] = new ObjectId(filters[key]);
        }
    }
    return filters;
}

module.exports = { stringIdToObjectId };