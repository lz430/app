import queryString from 'query-string';

/**
 *
 * @param searchQuery
 * @param format
 * @returns {*}
 */
export const buildSearchQueryUrl = (searchQuery, format = 'string') => {
    const qsData = { ...searchQuery };
    delete qsData.location;
    delete qsData.page;
    const defaultQs = 'entity=model&purchaseStrategy=lease&sort=payment';
    let qs = queryString.stringify(qsData, { arrayFormat: 'none' });
    if (qs === defaultQs) {
        return false;
    }
    if (format === 'string') {
        return qs;
    }
    return qsData;
};
