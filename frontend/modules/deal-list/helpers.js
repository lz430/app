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
    delete qsData.make;
    const defaultQs = 'entity=model&purchaseStrategy=lease&sort=payment';

    if (qsData.filters && qsData.filters.length === 0) {
        delete qsData.filters;
    }

    let qs = queryString.stringify(qsData, { arrayFormat: 'none' });

    if (format === 'string') {
        if (qs === defaultQs) {
            return false;
        }
        return qs;
    }

    if (qs === defaultQs) {
        return {};
    }
    return qsData;
};
