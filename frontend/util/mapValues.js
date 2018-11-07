/**
 * @param object
 * @param iteratee
 */
export default function mapValues(object, iteratee) {
    let result = {};

    Object.keys(object).forEach(key => {
        result[key] = iteratee(object[key], key, object);
    });

    return result;
}
