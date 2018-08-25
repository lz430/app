import queryString from 'query-string';

/**
 *
 * @param searchQuery
 */
export const buildSearchQueryUrl = searchQuery => {
    const qsData = { ...searchQuery };
    delete qsData.location;
    const defaultQs = 'entity=model&page=1&purchaseStrategy=lease&sort=payment';
    let qs = queryString.stringify(qsData, { arrayFormat: 'bracket' });
    if (qs === defaultQs) {
        return false;
    }

    return qs;
};
