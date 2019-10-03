const convertObjectToArray = (obj = null) => {
    if (!obj) {
        return null;
    }
    return Object.keys(obj).map(key => ({
        ...obj[key],
        id: key
    }));
};

export {
    convertObjectToArray
};