import { convertObjectToArray } from './objectUtils.js';

const processHookVals = (vals) => {
    return [
        typeof vals[0] !== 'undefined' ? convertObjectToArray(vals[0].val()) : vals[0],
        vals[1],
        vals[2]
    ];
};

export {
    processHookVals
};